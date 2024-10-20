## 📌 시작 전 확인 사항

### ✔️ 실행 방법

```
$ npm install
$ npm start
```
## 기술스택
- BE<br>
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white"/>
<img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white"/>
<img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white"/>
<img src="https://img.shields.io/badge/Nginx-009639?style=flat-square&logo=nginx&logoColor=white"/>
-  FE<br>
<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white"/>
<img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white"/>
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black"/>
<img src="https://img.shields.io/badge/EJS-90A93A?style=flat-square&logo=ejs&logoColor=white"/>

## 아키텍쳐
```mermaid
graph LR
    A[💻 Client] -->|HTTP/HTTPS| B["🖧 Nginx"]
    B -->|Reverse Proxy| C[🖥️ WAS]
    C -->|Cache| D["⚡ Redis"]
    C -->|Persist Data| E["🐬 MySQL"]
    D --> |Batch| E

    style A fill:#FFD700,stroke:#FFA500,stroke-width:2px,color:#000
    style B fill:#87CEFA,stroke:#4169E1,stroke-width:2px,color:#000
    style C fill:#98FB98,stroke:#228B22,stroke-width:2px,color:#000
    style D fill:#FF69B4,stroke:#C71585,stroke-width:2px,color:#000
    style E fill:#DDA0DD,stroke:#8B008B,stroke-width:2px,color:#000

    classDef iconNode font-weight:bold
    class B,D iconNode
```

## 성능개선
- Redis를 사용하여 db 접근을 최소화 했습니다.
<br>(100회의 게시글 조회시 db접근횟수 100회 → 1회)
  - https://mini-96.tistory.com/719
- 3800 밀리초의 게시글 조회를 150 밀리초로 개선하였습니다.
  - https://mini-96.tistory.com/716

## OAuth 구현
- 외부 라이브러리 도움 없이 직접 구현했습니다.
  - https://mini-96.tistory.com/714

## 자동배포
- main 브랜치에 push하면 자동으로 배포됩니다.
  - https://mini-96.tistory.com/667

## ERD
![image](https://github.com/user-attachments/assets/d19a66e9-61db-418d-9c52-77fe6cc747b6)