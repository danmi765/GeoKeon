/* 최종 로그인 시점의 세션상태를 저장하는 곳 */
/* Java의 VO 역할 */
let loggedinTime;   /* 마지막 로그인 시간 */

exports.setSessionStorage = (session) => {
    loggedinTime = session;
    return loggedinTime;
}
exports.getSessionStorage = (session) => {
    return loggedinTime;
}