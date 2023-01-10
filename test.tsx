// __tests__/hello_world.test.js
import { shallow } from 'enzyme'

describe('Hello, Enzyme!', () => {
    it('renders', () => {
        const wrapper = shallow(<div>
            <h1>Hello, Enzyme!</h1>
        </div>)
        expect(screen.getByRole('h1').html()).toMatch(/Hello, Enzyme/)
    })

    it('renders snapshots, too', () => {
        const wrapper = shallow(<div>
            <h1>Hello, Enzyme!</h1>
        </div>)
        expect(wrapper).toMatchSnapshot()
    })
})
