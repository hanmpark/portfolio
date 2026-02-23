import './TechStack.css'

const stackItemVisuals = {
  C: { icon: '/assets/stacks/c.svg' },
  Python: { icon: '/assets/stacks/python.svg' },
  JavaScript: { icon: '/assets/stacks/javascript.svg' },
  TypeScript: { icon: '/assets/stacks/typescript.svg' },
  React: { icon: '/assets/stacks/react.svg' },
  Redux: { icon: '/assets/stacks/redux.svg' },
  'Styled-components': { icon: '/assets/stacks/styled-components.svg' },
  HTML: { icon: '/assets/stacks/html.svg' },
  CSS: { icon: '/assets/stacks/css.svg' },
  Flask: { icon: '/assets/stacks/flask.svg' },
  'Node.js': { icon: '/assets/stacks/nodejs.svg' },
  'REST APIs': { monogram: 'API' },
  Unix: { icon: '/assets/stacks/bash.svg' },
  Networking: { monogram: 'Net' },
  'Memory management': { monogram: 'Mem' },
  Segmentation: { monogram: 'Seg' },
  'Model evaluation': { monogram: 'Eval' },
  'Stable Diffusion': { monogram: 'SD' },
  Git: { icon: '/assets/stacks/git.svg' },
  Docker: { icon: '/assets/stacks/docker.svg' },
  Linux: { icon: '/assets/stacks/linux.svg' },
}

const stackGroups = [
  {
    title: 'Languages',
    items: ['C', 'Python', 'JavaScript', 'TypeScript'],
  },
  {
    title: 'Frontend',
    items: ['React', 'Redux', 'Styled-components', 'HTML', 'CSS'],
  },
  {
    title: 'Backend',
    items: ['Flask', 'Node.js', 'REST APIs'],
  },
  {
    title: 'Systems / Low-level',
    items: ['Unix', 'Networking', 'Memory management'],
  },
  {
    title: 'AI / Image Processing',
    items: ['Segmentation', 'Model evaluation', 'Stable Diffusion'],
  },
  {
    title: 'Dev Tools',
    items: ['Git', 'Docker', 'Linux'],
  },
]

const getFallbackMonogram = (label) =>
  label
    .split(/[\s/.-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

const TechStack = () => {
  return (
    <section className="section tech-stack" id="tech-stack">
      <div className="container tech-stack-shell">
        <header className="tech-stack-header">
          <h2 className="section-title tech-stack-title">Engineering Foundations</h2>
        </header>

        <div className="tech-stack-groups" aria-label="Engineering foundations categories">
          {stackGroups.map((group) => (
            <article className="tech-stack-group" key={group.title}>
              <h3>{group.title}</h3>

              <div className="tech-stack-visuals" aria-hidden="true">
                {group.items.map((item) => {
                  const visual = stackItemVisuals[item] ?? {
                    monogram: getFallbackMonogram(item),
                  }

                  return (
                    <span
                      className={`tech-stack-visual${visual.icon ? '' : ' is-fallback'}`}
                      key={`${group.title}-${item}`}
                    >
                      {visual.icon ? (
                        <img src={visual.icon} alt="" loading="lazy" />
                      ) : (
                        <span>{visual.monogram}</span>
                      )}
                    </span>
                  )
                })}
              </div>

              <p>{group.items.join(' · ')}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TechStack
