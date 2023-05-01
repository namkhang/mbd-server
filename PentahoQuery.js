let impalaSchema  = 'data_lake'
let  imapalTable  = 'ASRASR_SD1'
let inclause = "'SD2310060047211-385116-SD1','SD2209070052131-385119-SD1','SD2108120054031-385106-SD1'"
let parseToArray = inclause.split(',')
let year = [...new Set(parseToArray.map(years => parseInt(`20${years.slice(3 , 5)}`)))]
let month = [...new Set(parseToArray.map(months => parseInt(`${months.slice(5 , 7)}`)))]
let day = [...new Set(parseToArray.map(days => parseInt(`${days.slice(7 , 9)}`)))]
var query = `select distinct trunc(calendar_timestamp, 'dd') calendar_timestamp, filename from  ${impalaSchema}.${imapalTable}  where filename in (${inclause}) and year IN (${year.join(',')}) and month IN (${month.join(',')}) and day IN (${day.join(',')})`

console.log(query);