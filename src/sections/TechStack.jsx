import { sectionCopy } from '../data/home.js'
import './TechStack.css'

const stackItems = [
  { name: 'C', icon: '/assets/stacks/c.svg' },
  { name: 'C++', icon: '/assets/stacks/cpp.svg' },
  { name: 'Python', icon: '/assets/stacks/python.svg' },
  { name: 'Docker', icon: '/assets/stacks/docker.svg' },
  { name: 'JavaScript', icon: '/assets/stacks/javascript.svg' },
  { name: 'React', icon: '/assets/stacks/react.svg' },
  { name: 'AngularJS', icon: '/assets/stacks/angular.svg' },
  { name: 'Git', icon: '/assets/stacks/git.svg' },
  { name: 'ExpressJS', icon: '/assets/stacks/expressjs.svg' },
  { name: 'HTML', icon: '/assets/stacks/html.svg' },
  { name: 'CSS', icon: '/assets/stacks/css.svg' },
  { name: 'Node.js', icon: '/assets/stacks/nodejs.svg' },
]

const StackLane = ({ items, direction }) => {
  const loopedItems = [...items, ...items]

  return (
    <div className={`stack-lane stack-lane-${direction}`}>
      <div className="stack-track">
        {loopedItems.map((item, index) => (
          <span className="stack-pill" key={`${direction}-${item.name}-${index}`}>
            <span className="stack-icon-wrap">
              <img className="stack-icon" src={item.icon} alt="" aria-hidden="true" />
            </span>
            <span className="stack-label">{item.name}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

const TechStack = () => {
  const firstLane = stackItems.slice(0, 6)
  const secondLane = stackItems.slice(6)

  return (
    <section className="section tech-stack" id="tech-stack">
      <div className="container stack-carousel">
        <StackLane items={firstLane} direction="rtl" />
        <StackLane items={secondLane} direction="ltr" />
      </div>

      <div className="container section-head tech-stack-head">
        <div>
          <p className="eyebrow">{sectionCopy.stack.eyebrow}</p>
          <h2 className="section-title">{sectionCopy.stack.title}</h2>
        </div>
        <p className="section-subtitle">{sectionCopy.stack.subtitle}</p>
      </div>
    </section>
  )
}

export default TechStack
