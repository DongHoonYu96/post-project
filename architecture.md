# 아키텍처 구조
![image](https://github.com/user-attachments/assets/f685c46b-f4f6-4a52-b534-6efc3bbff4b4)
- was 구조
![image](https://github.com/user-attachments/assets/69a5c852-bd0f-4428-8b1f-674ed7cb8577)
- 컨트롤러 구조
  ![image](https://github.com/user-attachments/assets/7414bf56-1cae-4a92-b25d-f64535ec72ba)

- ERD<br>
  ![image](https://github.com/user-attachments/assets/7d068c99-ff80-4c89-9f42-8eeb5fe886ff)

  

# API 명세서
## Auth
|api설명|URI|HTTP method|구현여부|
|---|---|---|---|
|로그인|/api/auth/login|POST|-|
|로그아웃|api/auth/logout|POST|-|
|회원가입|/api/auth/signup|POST|-|
|회원탈퇴|/api/auth/withdraw|POST|-|
|아이디중복체크|/api/auth/emailcheck|POST|-|

## Members
|api설명|URI|HTTP method|구현여부|
|---|---|---|---|
|회원정보조회|/api/members|GET|-|
|개인회원정보조회|/api/members/:id|GET|-|

## Posts
|api설명|URI|HTTP method|구현여부|
|---|---|---|---|
|게시글전체조회|api/posts|GET|-|
|게시글조회|api/posts/:id|GET|-|
|게시글생성|api/posts|POST|-|
|게시글수정|api/posts/id|PATCH|-|
|게시글삭제|api/posts/:id|DELETE|-|

## Comment
|api설명|URI|HTTP method|구현여부|
|---|---|---|---|
|게시글에 작성된 댓글조회|api/comments?postId={postId}|GET|-|
|댓글생성|api/comments|POST|-|
|댓글수정|api/comments/:id|PATCH|-|
|댓글삭제|api/comments/:id|POST|-|
|댓글좋아요|api/comments/:id/likes|POST|-|


# 기능 명세서

|페이지|기능|설명|권한|중요도|데이터|
|---|---|---|---|---|---|
|상단|로그아웃|사용자는 로그아웃을 할 수 있다|회원|1||
||이동|로그인페이지로 이동할 수 있다|비회원|1||
||이동|멤버 리스트 페이지로 이동할 수 있다.|회원|1||
||탈퇴|회원 탈퇴할 수 있다.|회원|3||
|메인페이지|조회|전체 게시글을 조회할 수 있다.(상세 불가능)|비회원|1||
||조회|게시글을 조회, 생성할 수 있다.|회원|1|post|
|로그인페이지|로그인|로그인을 할 수 있다|비회원|1|member|
||회원가입|회원가입 페이지로 이동할 수 있다|비회원|1||
|회원가입페이지|회원가입|회원가입을 할 수 있다|비회원|1|member|
||검증|이메일 중복을 체크한다|비회원|2|email|
|글쓰기페이지|글쓰기|게시글을 작성 할 수 있다|회원|1|post|
||글수정|게시글을 수정 할 수 있다|회원|2|post|
|상세페이지|댓글|댓글을 작성, 수정, 삭제 할 수 있다|회원|1|comment|
||이동|게시글 수정 페이지로 이동할 수 있다.|회원|2||
||삭제|게시글을 삭제 할 수 있다.|회원|2||
||이동|이전 글, 다음 글로 이동할 수 있다.|회원|2||
|멤버리스트페이지|조회|멤버 목록을 조회할 수 있다.|회원|2||

