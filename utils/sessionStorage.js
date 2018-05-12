/* 최종 로그인 시점의 세션상태를 저장하는 곳 */
/* Java의 VO 역할 */
let sessionStorage = {};   /* 마지막 로그인 시간 */

exports.setSessionStorage = (user_id, loginDt) => {
    sessionStorage[user_id] = loginDt;
    console.log('[setSessionStorage]sessionStorage', sessionStorage);
    return sessionStorage;
}
exports.getSessionStorage = (user_id) => {
    // console.log('[getSessionStorage]', sessionStorage);
    return (sessionStorage)?sessionStorage[user_id]:null;
}