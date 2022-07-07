import rewire from 'rewire'
const useBackgroundSettings = rewire('../useBackgroundSettings')
const getImage = useBackgroundSettings.__get__('getImage')
// @ponicode
describe('getImage', () => {
  test('0', () => {
    let result: any = getImage(-100)
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    let result: any = getImage(1)
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    let result: any = getImage(0)
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    let result: any = getImage(100)
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    let result: any = getImage(-1)
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    let result: any = getImage(Infinity)
    expect(result).toMatchSnapshot()
  })
})
