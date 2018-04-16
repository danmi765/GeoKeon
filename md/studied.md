# 알게된 것 & 연구
- `DB 커넥션 관리` :
    - 클라이언트가 서버에 요청 시에 서버에서는 DB인스턴스 생성을 가장 먼저 한다.
    - 이후에 생성된 인스턴스 객체를 콜백함수로 태워서 내보내고 쿼리를 한다.
    - 여러 클라이언트가 한 서버에 요청을 하는 만큼 DB인스턴스가 생성되는지?
    >`커넥션 풀`로 관리하자
    > - MySQL 계정 및 최대 연결 커넥션 입력 가능
    > - 참고 : http://blog.naver.com/PostView.nhn?blogId=wnsqkdj&logNo=220617269673&redirect=Dlog&widgetTypeCall=true


- ConnectionPool vs createConnection
    - Request가 많아질 경우, 커넥션 풀 사용시 메모리 사용량 감소, 속도 향상


- `MySQL` :  
    - 연결된 클라이언트 확인하기 :   
     `require('mysql').createConnection()` 이후 `.connect()`를 하게 되면, Connections 카운트가 1씩 늘어나게 된다. 이 부분은 `MySQL Workbench -> Server Status` 에서 `Connections` 그래프로 확인 가능하다.
    - 연결된 클라이언트 강제 연결끊기 :   
    `MySQL Workbench -> Server Status` 에서 `Client Connections`에서 리스트를 확인 할 수 있고, 해당 리스트에서 끊고자 하는 연결리스트에 단축메뉴를 띄운 뒤 `Kill Connection(s)` 를 선택한다.
    - 작업중인 db 안의 테이블 목록 조회하는 SQL :
    ```
    SELECT *
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = 'joparkdb'```
