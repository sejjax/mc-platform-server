// export const exprBuilder = (data: any[], builder: (data: any[]) => string) =>
//     () => data.length > 0 ? builder(data) : ''
// const select = (args?, ...data) => exprBuilder(data, (data) => `select ${data.join(',')}`)
// const from = (args?, ...data) => exprBuilder(data, (data) => `from ${data.join(',')}`)
// const orderBy = (args?, ...data) => exprBuilder(data, (data) => `order by ${data.join(',')}`)
// const where = (args?, ...data) => exprBuilder(data, (data) => `where ${data.join('and')}`)
// const limit = (val?: number) => val != null ? `limit ${val}` : ''
// const offset = (val?: number) => val != null ? `offset ${val}` : ''
// const query = (args?, ...data) => exprBuilder(data, (data) => `${data.join(' ')}`)
// type QueryBuildFunctions = 'select' | 'from' | 'where'
// const findArgs = (str: string): string[] => {}
//
// const formatString = (strings: string[], object: object): string[] => {}
//
//
// join(
//     '',
//     '',
//     '',
//     sep='and'
// )