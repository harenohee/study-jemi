const express = require("express");
// const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("port", process.env.PORT || 3000);

// html코드
const addBoardPage = `<!DOCTYPE html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                  <title>Restful API exercise</title>
                </head>
                <body>
                  <h2>게시판 추가</h2>
                  <form action="/boards" method="POST">
                    <label>
                      <input type="text" placeholder="게시판 이름을 입력하세요." name="board_name" />
                      <span>비공개 🔒</span>
                      <input type="checkbox" name="privacy_checked"/>
                      <input type="submit" />
                    </label>
                  </form>
                </body>
              </html>
`;

const addPostPage = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>게시글 작성</title>
  </head>
  <body>
    <h2>게시글 작성</h2>
    <form action="/posts" method="POST">
      <label>
        <select name="board_name">
          <option value="유머">유머</option>
          <option value="일상">일상</option>
          <option value="네일">네일</option>
        </select>
        <input type="text" placeholder="제목을 입력하세요." name="title" />
        <textarea id="post" name="content" rows="5" cols="33">
          It was a dark and stormy night...
        </textarea>
        <input placeholder="작성자" name="creator" />
        <span>비공개🔒</span>
        <input type="checkbox" name="privacy_checked"/>
        <input type="submit" value="글쓰기"/>
        </label>
    </form>
  </body>
</html>
`;

// 게시글 수정 ui
const updatePost = `
<h2>게시글 수정</h2>
<form action="posts" method="POST">
<label>
  <select name="board_name">
    <option value="유머">유머</option>
    <option value="일상">일상</option>
    <option value="네일">네일</option>
  </select>
  <input type="text" placeholder="" name="title" />
  <textarea id="post" name="content" rows="5" cols="33">
    It was a dark and stormy night...
  </textarea>
  <span>비공개🔒</span>
  <input type="checkbox" name="privacy_checked"/>
  <input type="submit" value="수정"/>
  </label>
</form>`;

// 게시판 and 게시글 공개-비공개 enum
const PRIVACY = {
  PUBLIC: "public",
  SECRET: "secret",
};

// board db
const data = {
  boards: [
    {
      id: 1,
      name: "유머",
      privacy: PRIVACY.PUBLIC,
      is_delete: false,
    },
    {
      id: 2,
      name: "일상",
      privacy: PRIVACY.PUBLIC,
      is_delete: false,
    },
    {
      id: 3,
      name: "네일",
      privacy: PRIVACY.SECRET,
      is_delete: true,
    },
  ],
  boards_posts: [
    { id: 1, boards_id: 1, posts_id: [2] },
    { id: 2, boards_id: 2, posts_id: [1, 2] },
    { id: 3, boards_id: 3, posts_id: [3] },
  ],
  posts: [
    {
      id: 1,
      title: "일상글",
      created_at: Date.now(),
      is_delete: false,
      privacy: PRIVACY.PUBLIC,
      creator: "닌자1",
      content: {
        thumnail_url: "",
        text: "글내용글내용글내용글내용글내용글내용글내용",
      },
      view_count: 0,
      board_id: 2,
    },
    {
      id: 2,
      title: "일상글",
      created_at: Date.now(),
      is_delete: false,
      privacy: PRIVACY.PUBLIC,
      creator: "닌자1.5",
      content: {
        thumnail_url: "",
        text: "글내용글내용글내용글내용글내용글내용글내용",
      },
      view_count: 0,
      board_id: 2,
    },
    {
      id: 3,
      title: "유머글",
      created_at: Date.now(),
      is_delete: false,
      privacy: PRIVACY.PUBLIC,
      creator: "닌자2",
      content: {
        thumnail_url: "",
        text: "글내용글내용글내용글내용글내용글내용글내용",
      },
      view_count: 0,
      board_id: 1,
    },
    {
      id: 4,
      title: "네일글",
      created_at: Date.now(),
      is_delete: false,
      privacy: PRIVACY.PUBLIC,
      creator: "닌자3",
      content: {
        thumnail_url: "",
        text: "글내용글내용글내용글내용글내용글내용글내용",
      },
      view_count: 0,
      board_id: 3,
    },
  ],
};

// 게시판 추가
app.get("/", (req, res) => {
  res.send(addBoardPage);
});
// board 조회
app.get("/boards", (req, res) => {
  const filterBoardCondition = data.boards.filter(
    (item) => item.is_delete == false && item.privacy == PRIVACY.PUBLIC
  );
  const result = filterBoardCondition.filter((item) => item != null);
  //  is_delete가 false인 값만 화면에 표시
  res.json(result);
});

// board 생성
app.post("/boards", (req, res) => {
  const { board_name, privacy_checked } = req.body;

  // console.log("마지막 id값: ", data.boards[data.boards.length - 1].id);
  let currentId = data.boards[data.boards.length - 1].id;
  const newBoard = {
    id: currentId + 1,
    name: board_name,
    privacy: privacy_checked == "on" ? PRIVACY.SECRET : PRIVACY.PUBLIC,
    is_delete: false,
  };
  data.boards.push(newBoard);
  res.send(newBoard);
});

//board 수정
app.put("/boards/:id", (req, res) => {
  console.log("업데이트 id: ", req.params.id);
  const updateData = data.boards.map((item) => {
    if (req.params.id == item.id) {
      return { ...item, name: "이름수정수정", privacy: PRIVACY.SECRET };
    }
    return item;
  });
  res.send(updateData);
});

// board 삭제 (soft delete)
app.delete("/boards/:id", (req, res) => {
  const deleteData = data.boards.map((item) => {
    if (item.id == req.params.id) {
      return { ...item, is_delete: !item.is_delete };
    }
    return item;
  });
  console.log("삭제 후 db: ", deleteData);
  res.send(deleteData);
});

// 게시글 list 조회
// 삭제, 공개 여부 체크
app.get("/boards/:id", (req, res) => {
  req.params.id == data.boards_posts.board_id;
  const filterId = data.boards_posts.find(
    (item) => item.boards_id == req.params.id
  );
  console.log(filterId);
  console.log(filterId.posts_id);
  // [1.2] => post 배열에서 추출
  const postList = [];
  // boards_posts 에 있는 post_id값만 불러오기
  for (const ele of filterId.posts_id) {
    const postElement = data.posts.find((i) => i.id == ele);
    console.log(postElement);
    postList.push(postElement);
  }
  console.log(postList);

  res.send(postList);
});

// 게시글 작성페이지
app.get("/posts/new", (req, res) => {
  res.send(addPostPage);
});

// 게시글 작성
app.post("/posts", (req, res) => {
  const { title, content, creator, privacy_checked, board_name } = req.body;
  console.log("Post 마지막 title: ", data.posts[data.posts.length - 1].title);
  let currentId = data.posts[data.posts.length - 1].id;
  const newPost = {
    id: currentId + 1,
    title,
    privacy: privacy_checked == "on" ? PRIVACY.SECRET : PRIVACY.PUBLIC,
    is_delete: false,
    content: {},
    creator,
    created_at: new Date(),
    modified_at: this.created_at,
    view_count: 0,
    board_id: board_name == "유머" ? 1 : board_name == "일상" ? 2 : 3,
  };
  data.posts.push(newPost);
  if (board_name == "유머") data.boards_posts[1].posts_id.push(newPost.id);
  if (board_name == "일상") data.boards_posts[2].posts_id.push(newPost.id);
  if (board_name == "네일") data.boards_posts[3].posts_id.push(newPost.id);
  res.status(200).send("포스팅 완료!");
});

// 게시글 조회
app.get("/posts/:id", (req, res) => {
  const filterBoardCondition = data.boards.filter(
    (item) => item.is_delete == false && item.privacy == PRIVACY.PUBLIC
  );
  const result = filterBoardCondition.filter((item) => item != null);
  //  is_delete가 false인 값만 화면에 표시
  // res.json(result);
  res.send(result);
});
// 게시글 수정
app.put("/posts/:id", (req, res) => {
  console.log("업데이트", req.body);
  console.log("업데이트 id: ", req.params.id);
  const updateData = data.posts.map((item) => {
    if (req.params.id == item.id) {
      return {
        ...item,
        modified_at: Date.now(),
        creator: "이름수정",
        privacy: PRIVACY.SECRET,
        board_name: "네일",
        board_id: 3,
        content: "textextex",
      };
    }
    return item;
  });
  res.send(updateData);
});

// 게시글 삭제

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중!!!!!!!!!!!");
});
