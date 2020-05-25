import chai from 'chai'
import sinonChai from 'sinon-chai'
import chaiAsPromised from 'chai-as-promised'
import chaiAlmost from 'chai-almost'

chai.use(sinonChai)
chai.use(chaiAsPromised)
chai.use(chaiAlmost())
