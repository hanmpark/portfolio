import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "../../i18n/useLanguage.js";
import "./SoLongPlayable.css";

const ASSET_ROOT = "/demos/so-long";
const TILE_SIZE = 64;
const VIEW_COLUMNS = 13;
const VIEW_ROWS = 9;
const CANVAS_WIDTH = 832;
const CANVAS_HEIGHT = 704;
const FPS = 40;
const FRAME_DURATION = 1000 / FPS;
const PLAYER_SPEED = 4;
const ENEMY_SPEED = 2;

const LEVELS = [0, 1, 2, 3, 4].map((index) => ({
  index,
  map: `${ASSET_ROOT}/maps/game_${index}.ber`,
}));

const DIRECTION_ORDER = ["left", "right", "down", "up"];
const DIRECTION_VECTORS = {
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
  down: { dx: 0, dy: 1 },
  up: { dx: 0, dy: -1 },
};

const KEY_DIRECTIONS = {
  ArrowLeft: "left",
  a: "left",
  q: "left",
  ArrowRight: "right",
  d: "right",
  ArrowDown: "down",
  s: "down",
  ArrowUp: "up",
  w: "up",
  z: "up",
};

const NAMED_COLORS = {
  black: [0, 0, 0, 255],
  white: [255, 255, 255, 255],
};

let cachedAssetsPromise;

const ArrowIcon = ({ direction }) => {
  const path = {
    up: "M12 19V5m0 0-7 7m7-7 7 7",
    down: "M12 5v14m0 0 7-7m-7 7-7-7",
    left: "M19 12H5m0 0 7 7m-7-7 7-7",
    right: "M5 12h14m0 0-7-7m7 7-7 7",
  }[direction];

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
};

const parseColor = (value) => {
  if (!value || value.toLowerCase() === "none") return [0, 0, 0, 0];

  const normalized = value.toLowerCase();
  if (NAMED_COLORS[normalized]) return NAMED_COLORS[normalized];

  const gray = normalized.match(/^gr[ae]y(\d+)$/);
  if (gray) {
    const channel = Math.round((Number(gray[1]) / 100) * 255);
    return [channel, channel, channel, 255];
  }

  const hex = normalized.match(/^#([0-9a-f]{6})$/);
  if (!hex) return [0, 0, 0, 255];

  return [
    Number.parseInt(hex[1].slice(0, 2), 16),
    Number.parseInt(hex[1].slice(2, 4), 16),
    Number.parseInt(hex[1].slice(4, 6), 16),
    255,
  ];
};

const extractXpmStrings = (source) => {
  const strings = [];
  const pattern = /"((?:\\.|[^"\\])*)"/g;
  let match = pattern.exec(source);

  while (match) {
    strings.push(match[1].replace(/\\"/g, '"').replace(/\\\\/g, "\\"));
    match = pattern.exec(source);
  }

  return strings;
};

const xpmToCanvas = (source) => {
  const strings = extractXpmStrings(source);
  const [width, height, colorCount, charsPerPixel] = strings[0]
    .trim()
    .split(/\s+/)
    .map(Number);
  const colors = new Map();

  for (let i = 1; i <= colorCount; i += 1) {
    const line = strings[i];
    const key = line.slice(0, charsPerPixel);
    const colorValue = line
      .slice(charsPerPixel)
      .trim()
      .match(/\bc\s+(.+)$/i)?.[1]
      ?.trim();

    colors.set(key, parseColor(colorValue));
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  const image = context.createImageData(width, height);
  const pixels = strings.slice(1 + colorCount, 1 + colorCount + height);

  for (let y = 0; y < height; y += 1) {
    const row = pixels[y];
    for (let x = 0; x < width; x += 1) {
      const color = colors.get(
        row.slice(x * charsPerPixel, (x + 1) * charsPerPixel),
      ) ?? [0, 0, 0, 0];
      const offset = (y * width + x) * 4;
      image.data[offset] = color[0];
      image.data[offset + 1] = color[1];
      image.data[offset + 2] = color[2];
      image.data[offset + 3] = color[3];
    }
  }

  context.putImageData(image, 0, 0);
  return canvas;
};

const fetchText = async (path) => {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Unable to load ${path}`);
  return response.text();
};

const loadXpm = async (path) => xpmToCanvas(await fetchText(path));

const rangePaths = (folder, prefix, count) =>
  Array.from(
    { length: count },
    (_, index) => `${ASSET_ROOT}/img/${folder}/${prefix}${index}.xpm`,
  );

const loadFrames = (paths) => Promise.all(paths.map(loadXpm));

const loadAssets = async () => {
  const [
    wall,
    dead,
    floors,
    exits,
    borders,
    numbers,
    down,
    up,
    left,
    right,
    mob,
    collectible,
  ] = await Promise.all([
    loadXpm(`${ASSET_ROOT}/img/env/wall.xpm`),
    loadXpm(`${ASSET_ROOT}/img/player/dead.xpm`),
    loadFrames([
      `${ASSET_ROOT}/img/env/ground.xpm`,
      `${ASSET_ROOT}/img/env/ground1.xpm`,
      `${ASSET_ROOT}/img/env/ground2.xpm`,
    ]),
    loadFrames([
      `${ASSET_ROOT}/img/env/exit0.xpm`,
      `${ASSET_ROOT}/img/env/exit1.xpm`,
    ]),
    loadFrames([
      `${ASSET_ROOT}/img/border/border.xpm`,
      `${ASSET_ROOT}/img/border/border_go.xpm`,
      `${ASSET_ROOT}/img/border/border_lvl.xpm`,
    ]),
    loadFrames(rangePaths("numbers", "", 10)),
    loadFrames(rangePaths("player/dir/down", "down", 4)),
    loadFrames(rangePaths("player/dir/up", "up", 4)),
    loadFrames(rangePaths("player/dir/left", "left", 4)),
    loadFrames(rangePaths("player/dir/right", "right", 4)),
    loadFrames(rangePaths("mob", "mob", 8)),
    loadFrames(rangePaths("collectible", "coin", 7)),
  ]);

  return {
    wall,
    dead,
    floors,
    exits,
    borders,
    numbers,
    player: { down, up, left, right },
    mob,
    collectible,
  };
};

const getAssets = () => {
  if (!cachedAssetsPromise) cachedAssetsPromise = loadAssets();
  return cachedAssetsPromise;
};

const isWalkable = (game, x, y) => game.map[y]?.[x] !== "1";

const createEnemy = (map, x, y) => {
  const leftOpen = map[y]?.[x - 1] !== "1";
  const rightOpen = map[y]?.[x + 1] !== "1";

  return {
    x,
    y,
    movePx: 0,
    direction: leftOpen ? "left" : rightOpen ? "right" : "static",
  };
};

const createGame = (mapText) => {
  const map = mapText
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => line.trim().split(""));
  const enemies = [];
  let player = null;
  let exit = null;
  let totalCollectibles = 0;

  map.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === "P") {
        player = { x, y };
        row[x] = "0";
      } else if (cell === "M") {
        enemies.push(createEnemy(map, x, y));
        row[x] = "0";
      } else if (cell === "E") {
        exit = { x, y };
      } else if (cell === "C") {
        totalCollectibles += 1;
      }
    });
  });

  if (!player || !exit) throw new Error("Invalid so_long map");

  return {
    map,
    width: map[0].length,
    height: map.length,
    player,
    exit,
    enemies,
    totalCollectibles,
    collected: 0,
    moves: 0,
    frames: 0,
    state: "playing",
    exitOpen: totalCollectibles === 0,
    enemyMoving: false,
    playerMove: null,
    facing: "down",
    playerFrame: 0,
    mobFrame: 0,
    collectibleFrame: 0,
    mapOffsetX: 0,
    mapOffsetY: 0,
    lastDirection: "down",
    queuedDirection: null,
  };
};

const getRequestedDirection = (game, keys) => {
  if (game.queuedDirection) {
    const direction = game.queuedDirection;
    game.queuedDirection = null;
    return direction;
  }

  if (keys.has(game.lastDirection)) return game.lastDirection;
  return DIRECTION_ORDER.find((direction) => keys.has(direction));
};

const startPlayerMove = (game, direction) => {
  const vector = DIRECTION_VECTORS[direction];
  const nextX = game.player.x + vector.dx;
  const nextY = game.player.y + vector.dy;

  game.facing = direction;
  if (!isWalkable(game, nextX, nextY)) return;

  game.playerMove = {
    direction,
    dx: vector.dx,
    dy: vector.dy,
    progress: 0,
  };
};

const finishPlayerMove = (game) => {
  const { dx, dy } = game.playerMove;
  const nextX = game.player.x + dx;
  const nextY = game.player.y + dy;

  game.player = { x: nextX, y: nextY };
  game.moves += 1;
  game.mapOffsetX = 0;
  game.mapOffsetY = 0;
  game.playerMove = null;
  game.playerFrame = 0;

  if (game.map[nextY][nextX] === "C") {
    game.map[nextY][nextX] = "0";
    game.collected += 1;
    game.exitOpen = game.collected === game.totalCollectibles;
  }

  if (game.exitOpen && nextX === game.exit.x && nextY === game.exit.y) {
    game.state = "win";
  }
};

const updatePlayer = (game, keys) => {
  if (game.state !== "playing") return;

  if (!game.playerMove) {
    const direction = getRequestedDirection(game, keys);
    if (direction) startPlayerMove(game, direction);
  }

  if (!game.playerMove) return;

  game.playerMove.progress += PLAYER_SPEED;
  game.mapOffsetX = -game.playerMove.dx * game.playerMove.progress;
  game.mapOffsetY = -game.playerMove.dy * game.playerMove.progress;

  if (game.frames % 5 === 0) {
    game.playerFrame = (game.playerFrame + 1) % 4;
  }

  if (game.playerMove.progress >= TILE_SIZE) finishPlayerMove(game);
};

const updateEnemies = (game) => {
  if (game.frames % 4 === 0) {
    game.mobFrame = (game.mobFrame + 1) % 8;
  }

  if (game.frames % 100 === 0) {
    game.enemyMoving = true;
  }

  if (!game.enemyMoving) return;

  let moving = false;
  game.enemies.forEach((enemy) => {
    if (enemy.direction === "static") return;

    const delta = enemy.direction === "left" ? -ENEMY_SPEED : ENEMY_SPEED;
    enemy.movePx += delta;
    moving = true;

    if (Math.abs(enemy.movePx) >= TILE_SIZE) {
      enemy.x += enemy.direction === "left" ? -1 : 1;
      enemy.movePx = 0;

      const nextX = enemy.x + (enemy.direction === "left" ? -1 : 1);
      if (!isWalkable(game, nextX, enemy.y)) {
        enemy.direction = enemy.direction === "left" ? "right" : "left";
      }
    }
  });

  game.enemyMoving = moving && game.enemies.some((enemy) => enemy.movePx !== 0);
};

const updateGame = (game, keys) => {
  game.frames += 1;

  if (game.frames % 5 === 0) {
    game.collectibleFrame = (game.collectibleFrame + 1) % 7;
  }

  updateEnemies(game);
  updatePlayer(game, keys);

  if (
    game.state === "playing" &&
    game.enemies.some(
      (enemy) => enemy.x === game.player.x && enemy.y === game.player.y,
    )
  ) {
    game.state = "over";
    game.playerMove = null;
    game.mapOffsetX = 0;
    game.mapOffsetY = 0;
  }
};

const drawSprite = (context, sprite, x, y) => {
  if (sprite) context.drawImage(sprite, Math.round(x), Math.round(y));
};

const renderTile = (context, game, assets, mapX, mapY, screenX, screenY) => {
  if (mapX < 0 || mapX >= game.width || mapY < 0 || mapY >= game.height) {
    drawSprite(context, assets.floors[2], screenX, screenY);
    drawSprite(context, assets.wall, screenX, screenY);
    return;
  }

  const floorIndex =
    (mapX % 2 && !(mapY % 2)) || (!(mapX % 2) && mapY % 2) ? 0 : 1;
  const cell = game.map[mapY][mapX];

  drawSprite(context, assets.floors[floorIndex], screenX, screenY);

  if (cell === "C") {
    drawSprite(
      context,
      assets.collectible[game.collectibleFrame],
      screenX,
      screenY,
    );
  } else if (mapX === game.exit.x && mapY === game.exit.y) {
    drawSprite(context, assets.exits[game.exitOpen ? 1 : 0], screenX, screenY);
  } else if (cell === "1") {
    drawSprite(context, assets.wall, screenX, screenY);
  }
};

const renderMoves = (context, game, assets) => {
  let number = Math.min(game.moves, 9999);

  for (let i = 0; i < 4; i += 1) {
    const digit = number % 10;
    drawSprite(
      context,
      assets.numbers[digit],
      454 - (assets.numbers[0].width + 8) * i,
      593,
    );
    number = Math.floor(number / 10);
  }
};

const renderGame = (context, game, assets) => {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.imageSmoothingEnabled = false;

  const startX = game.player.x - 6;
  const startY = game.player.y - 4;

  for (let y = 0; y < VIEW_ROWS; y += 1) {
    for (let x = 0; x < VIEW_COLUMNS; x += 1) {
      renderTile(
        context,
        game,
        assets,
        startX + x,
        startY + y,
        x * TILE_SIZE + game.mapOffsetX,
        y * TILE_SIZE + game.mapOffsetY,
      );
    }
  }

  game.enemies.forEach((enemy) => {
    const screenX =
      (enemy.x - startX) * TILE_SIZE + game.mapOffsetX + enemy.movePx;
    const screenY = (enemy.y - startY) * TILE_SIZE + game.mapOffsetY;

    if (
      screenX > -TILE_SIZE &&
      screenX < CANVAS_WIDTH &&
      screenY > -TILE_SIZE &&
      screenY < VIEW_ROWS * TILE_SIZE
    ) {
      drawSprite(context, assets.mob[game.mobFrame], screenX, screenY);
    }
  });

  if (game.state === "over") {
    drawSprite(context, assets.dead, 6 * TILE_SIZE, 4 * TILE_SIZE);
  } else {
    const frames = assets.player[game.facing] ?? assets.player.down;
    drawSprite(
      context,
      frames[game.playerMove ? game.playerFrame : 0],
      6 * TILE_SIZE,
      4 * TILE_SIZE,
    );
  }

  const borderIndex = game.state === "over" ? 1 : game.state === "win" ? 2 : 0;
  drawSprite(context, assets.borders[borderIndex], 0, 0);
  renderMoves(context, game, assets);
};

const getDirectionFromKey = (key) => KEY_DIRECTIONS[key] ?? KEY_DIRECTIONS[key.toLowerCase?.()];

const SoLongPlayable = () => {
  const { t } = useLanguage();
  const canvasRef = useRef(null);
  const shellRef = useRef(null);
  const gameRef = useRef(null);
  const assetsRef = useRef(null);
  const keysRef = useRef(new Set());
  const activeRef = useRef(false);
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [restartKey, setRestartKey] = useState(0);
  const [loadState, setLoadState] = useState("loading");
  const [ui, setUi] = useState({
    moves: 0,
    collected: 0,
    totalCollectibles: 0,
    state: "playing",
  });

  const levels = useMemo(() => LEVELS, []);

  const syncUi = useCallback((game) => {
    setUi((current) => {
      const next = {
        moves: game.moves,
        collected: game.collected,
        totalCollectibles: game.totalCollectibles,
        state: game.state,
      };

      if (
        current.moves === next.moves &&
        current.collected === next.collected &&
        current.totalCollectibles === next.totalCollectibles &&
        current.state === next.state
      ) {
        return current;
      }

      return next;
    });
  }, []);

  const handleDirectionDown = useCallback((event) => {
    const direction = getDirectionFromKey(event.key);
    const shellHasFocus = shellRef.current?.contains(document.activeElement);
    if (!direction || (!activeRef.current && !shellHasFocus)) return;

    event.preventDefault();
    activeRef.current = true;
    keysRef.current.add(direction);
    if (gameRef.current) {
      gameRef.current.lastDirection = direction;
      gameRef.current.queuedDirection = direction;
    }
  }, []);

  const handleDirectionUp = useCallback((event) => {
    const direction = getDirectionFromKey(event.key);
    if (!direction) return;

    keysRef.current.delete(direction);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let frameId = 0;
    let lastFrame = 0;
    const context = canvasRef.current?.getContext("2d");

    if (!context) return undefined;

    setLoadState("loading");

    const boot = async () => {
      try {
        const [assets, mapText] = await Promise.all([
          getAssets(),
          fetchText(levels[selectedLevel].map),
        ]);

        if (cancelled) return;

        const game = createGame(mapText);
        gameRef.current = game;
        assetsRef.current = assets;
        keysRef.current.clear();
        setLoadState("ready");
        syncUi(game);
        renderGame(context, game, assets);

        const tick = (time) => {
          if (cancelled) return;

          if (time - lastFrame >= FRAME_DURATION) {
            lastFrame = time;
            updateGame(game, keysRef.current);
            renderGame(context, game, assets);
            syncUi(game);
          }

          frameId = window.requestAnimationFrame(tick);
        };

        frameId = window.requestAnimationFrame(tick);
      } catch {
        if (!cancelled) setLoadState("error");
      }
    };

    boot();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frameId);
    };
  }, [levels, restartKey, selectedLevel, syncUi]);

  useEffect(() => {
    window.addEventListener("keydown", handleDirectionDown);
    window.addEventListener("keyup", handleDirectionUp);

    return () => {
      window.removeEventListener("keydown", handleDirectionDown);
      window.removeEventListener("keyup", handleDirectionUp);
    };
  }, [handleDirectionDown, handleDirectionUp]);

  const focusGame = useCallback(() => {
    activeRef.current = true;
    shellRef.current?.focus({ preventScroll: true });
  }, []);

  const blurGame = useCallback(() => {
    activeRef.current = false;
    keysRef.current.clear();
  }, []);

  const restart = useCallback(() => {
    setRestartKey((value) => value + 1);
  }, []);

  const selectLevel = useCallback((index) => {
    setSelectedLevel(index);
    setRestartKey((value) => value + 1);
  }, []);

  const pressDirection = useCallback(
    (direction, event) => {
      event.preventDefault();
      event.currentTarget.setPointerCapture?.(event.pointerId);
      focusGame();
      keysRef.current.add(direction);
      if (gameRef.current) {
        gameRef.current.lastDirection = direction;
        gameRef.current.queuedDirection = direction;
      }
    },
    [focusGame],
  );

  const releaseDirection = useCallback((direction, event) => {
    event.preventDefault();
    keysRef.current.delete(direction);
  }, []);

  const status =
    loadState === "loading"
      ? t("soLong.loading")
      : loadState === "error"
        ? t("soLong.error")
        : ui.state === "win"
          ? t("soLong.win")
          : ui.state === "over"
            ? t("soLong.gameOver")
            : t("soLong.playing");

  return (
    <section className="so-long-playable" aria-label={t("soLong.title")}>
      <div className="so-long-topbar">
        <div>
          <p className="pj-section-label">{t("soLong.title")}</p>
          <p className="so-long-status" aria-live="polite">
            {status}
          </p>
        </div>

        <div className="so-long-actions">
          <div className="so-long-levels" aria-label={t("soLong.levels")}>
            {levels.map((level) => (
              <button
                key={level.index}
                type="button"
                className={
                  level.index === selectedLevel
                    ? "so-long-level is-active"
                    : "so-long-level"
                }
                onClick={() => selectLevel(level.index)}
              >
                {level.index + 1}
              </button>
            ))}
          </div>
          <button type="button" className="btn small" onClick={restart}>
            {t("soLong.restart")}
          </button>
        </div>
      </div>

      <div
        ref={shellRef}
        className="so-long-shell"
        tabIndex={0}
        onFocus={focusGame}
        onBlur={blurGame}
        onKeyDown={handleDirectionDown}
        onKeyUp={handleDirectionUp}
        onPointerDown={focusGame}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="so-long-canvas"
          aria-label={t("soLong.canvasLabel")}
        />
      </div>

      <div className="so-long-hud">
        <span>
          {t("soLong.moves")}: {ui.moves}
        </span>
        <span>
          {t("soLong.collectibles")}: {ui.collected}/{ui.totalCollectibles}
        </span>
      </div>

      <div className="so-long-controls" aria-label={t("soLong.controls")}>
        <button
          type="button"
          className="so-long-control so-long-control--up"
          aria-label={t("soLong.moveUp")}
          title={t("soLong.moveUp")}
          onPointerDown={(event) => pressDirection("up", event)}
          onPointerUp={(event) => releaseDirection("up", event)}
          onPointerCancel={(event) => releaseDirection("up", event)}
          onPointerLeave={(event) => releaseDirection("up", event)}
        >
          <ArrowIcon direction="up" />
        </button>
        <button
          type="button"
          className="so-long-control so-long-control--left"
          aria-label={t("soLong.moveLeft")}
          title={t("soLong.moveLeft")}
          onPointerDown={(event) => pressDirection("left", event)}
          onPointerUp={(event) => releaseDirection("left", event)}
          onPointerCancel={(event) => releaseDirection("left", event)}
          onPointerLeave={(event) => releaseDirection("left", event)}
        >
          <ArrowIcon direction="left" />
        </button>
        <button
          type="button"
          className="so-long-control so-long-control--down"
          aria-label={t("soLong.moveDown")}
          title={t("soLong.moveDown")}
          onPointerDown={(event) => pressDirection("down", event)}
          onPointerUp={(event) => releaseDirection("down", event)}
          onPointerCancel={(event) => releaseDirection("down", event)}
          onPointerLeave={(event) => releaseDirection("down", event)}
        >
          <ArrowIcon direction="down" />
        </button>
        <button
          type="button"
          className="so-long-control so-long-control--right"
          aria-label={t("soLong.moveRight")}
          title={t("soLong.moveRight")}
          onPointerDown={(event) => pressDirection("right", event)}
          onPointerUp={(event) => releaseDirection("right", event)}
          onPointerCancel={(event) => releaseDirection("right", event)}
          onPointerLeave={(event) => releaseDirection("right", event)}
        >
          <ArrowIcon direction="right" />
        </button>
      </div>
    </section>
  );
};

export default SoLongPlayable;
