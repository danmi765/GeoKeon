/* '2018-04-21T15:00:00.000Z' 의 Date형을 '2018-04-18 00:00' 형태로 바꿔드림 */
exports.getFormmatedDt = (formattedDtBefore) => {
    let set2Length = (val) => {return (val<10)?"0" + val:val;}
    let date = new Date(formattedDtBefore);
    let formattedDatetimeAfter = `${date.getFullYear()}-${set2Length(date.getMonth()+1)}-${set2Length(date.getDate())} ${set2Length(date.getHours())}:${set2Length(date.getMinutes())}`;
    let formattedDateAfter = `${date.getFullYear()}-${set2Length(date.getMonth()+1)}-${set2Length(date.getDate())}`;
    
    return {datetime: formattedDatetimeAfter, date: formattedDateAfter};
}