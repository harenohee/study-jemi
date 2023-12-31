const express = require("express");
// const path = require("path");
const app = express();

// 게시판 and 게시글 공개-비공개 enum
const PRIVACY = {
  PUBLIC: "public",
  SECRET: "secret",
};
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
      privacy: PRIVACY.PUBLIC,
      is_delete: false,
    },
  ],
  boards_posts: [
    { id: 1, boards_id: 1, posts_id: [3] },
    { id: 2, boards_id: 2, posts_id: [1, 2] },
    { id: 3, boards_id: 3, posts_id: [4] },
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
      title: "일상글2",
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

// 게시판 생성페이지 가져오기
app.get("/boards/new", (req, res) => {
  res.send(addBoardPage);
});
// board 조회
app.get("/boards", (req, res) => {
  const filterBoardCondition = data.boards.filter(
    (item) => item.is_delete == false && item.privacy == PRIVACY.PUBLIC
  );
  if (!filterBoardCondition) {
    return res.status(404).send("조회할 데이터가 없습니다.");
  }
  //  is_delete가 false인 값만 화면에 표시
  res.send(filterBoardCondition);
});

// board 생성
app.post("/boards", (req, res) => {
  const { board_name, privacy_checked } = req.body;
  if (!board_name) {
    return res.status(400).send("게시판을 생성할 수 없습니다.");
  }
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
  const { board_name, privacy_checked } = req.body;
  if (!board_name) {
    return res.status(500).send("변경 사항이 없습니다.");
  }
  const updateData = data.boards.find((item) => item.id == req.params.id);
  if (board_name.length == 0) {
    privacy_checked == "on" ? PRIVACY.SECRET : PRIVACY.PUBLIC;
    updateData.privacy = privacy_checked;
    return res.send(updateData);
  }
  if (privacy_checked.length == 0) {
    updateData.name = board_name;
    return res.send(updateData);
  } else {
    updateData.name = board_name;
    privacy_checked == "on" ? PRIVACY.SECRET : PRIVACY.PUBLIC;
    updateData.privacy = privacy_checked;
    return res.send(updateData);
  }
});

// board 삭제 (soft delete)
app.delete("/boards/:id", (req, res) => {
  if (!req.params) {
    return res
      .status(404)
      .send("BAD_REQUEST\n잘못된 요청입니다. 삭제할 보드를 확인해주세요.");
  }
  const deleteData = data.boards.find((item) => item.id == req.params.id);
  deleteData.is_delete = true;
  console.log("삭제 board db: ", deleteData);

  res.send(deleteData);
});

// 게시글 list 조회
// 삭제, 공개 여부 체크
app.get("/boards/:id", (req, res) => {
  if (!Object.keys(data.boards).includes(req.params.id)) {
    return res.status(400).send("BAD_REQUEST\n잘못된 게시판 요청입니다.");
  }
  const filterId = data.boards_posts.find(
    (item) => item.boards_id == req.params.id
  );
  // [1.2] => post 배열에서 추출
  const postList = [];
  // boards_posts 에 있는 post_id값만 불러오기
  for (const ele of filterId.posts_id) {
    const postElement = data.posts.find((i) => i.id == ele);
    console.log(postElement);
    postList.push(postElement);
  }
  console.log(postList);
  const filterPostListCondition = postList.filter(
    (item) => item.is_delete == false && item.privacy == PRIVACY.PUBLIC
  );
  if (filterPostListCondition.length == 0)
    return res.status(404).send("게시글이 없습니다.");
  else {
    return res.send(filterPostListCondition);
  }
});

// 게시글 작성페이지 가져오기
app.get("/posts/new", (req, res) => {
  res.send(addPostPage);
});

// 게시글 작성
app.post("/posts", (req, res) => {
  const { title, content, creator, privacy_checked, board_name } = req.body;
  let currentId = data.posts[data.posts.length - 1].id;
  const newPost = {
    id: currentId + 1,
    title,
    privacy: privacy_checked == "on" ? PRIVACY.SECRET : PRIVACY.PUBLIC,
    is_delete: false,
    content,
    creator,
    created_at: Date.now(),
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
app.get("/posts", (req, res) => {
  const filterPostCondition = data.posts.filter(
    (item) => item.is_delete == false && item.privacy == PRIVACY.PUBLIC
  );
  if (!filterPostCondition) {
    return res.status(404).send("조회할 게시글이 없습니다.");
  }
  //  is_delete가 false인 값만 화면에 표시
  // res.json(result);
  res.send(filterPostCondition);
});
// 게시글 수정
app.put("/posts/:id", (req, res) => {
  const { board_name, privacy_checked, content, title } = req.body;
  if (!title || !content) {
    return res.status(404).send("제목이나 내용이 빈 칸인지 확인해주세요.");
  }
  console.log("업데이트 id: ", req.params.id);
  let updateData = data.posts.find((item) => item.id == req.params.id); //배열 하나
  updateData = {
    ...updateData, // 기존 값 ex) id
    title, // 새로운 값
    modified_at: Date.now(),
    privacy: privacy_checked == "on" ? PRIVACY.SECRET : PRIVACY.PUBLIC,
    board_id: board_name == "유머" ? 1 : board_name == "일상" ? 2 : 3,
    content,
  };
  console.log("updateData", updateData);
  // boards_posts db 갱신
  const findIndexBoardId = data.boards_posts.find(
    ({ boards_id }) => boards_id == updateData.board_id
  );
  console.log("findIndexBoardId", findIndexBoardId);
  console.log(findIndexBoardId.id);
  // 변경한 boards_id에 맞는 posts_id 배열에 추가
  if (
    !data.boards_posts[findIndexBoardId.id - 1].posts_id.includes(
      updateData.board_id
    )
  )
    data.boards_posts[findIndexBoardId.id - 1].posts_id.push(
      updateData.board_id
    );

  console.log(data.boards_posts);
  // 기존 배열에선 제거
  console.log("수정할 게시물의 id ", updateData.id);
  const findIndexPostId = data.boards_posts.find(
    ({ posts_id }) => posts_id == updateData.id
  );
  console.log("findIndexPostId", findIndexPostId);
  console.log(
    "findIndexPostId의 인덱스",
    findIndexPostId.posts_id.indexOf(updateData.id)
  );
  const indexPostId = findIndexPostId.posts_id.indexOf(updateData.id);
  data.boards_posts[findIndexPostId.id - 1].posts_id.splice(indexPostId, 1);
  console.log(
    "제거 후 boards_posts DB",
    data.boards_posts[findIndexPostId.id - 1]
  );
  if (board_name == "유머")
    data.boards_posts[1].posts_id.push(updateData.board_id);
  if (board_name == "일상")
    data.boards_posts[2].posts_id.push(updateData.board_id);
  if (board_name == "네일")
    data.boards_posts[3].posts_id.push(updateData.board_id);
  res.send(updateData);
});

// 게시글 삭제
app.delete("/posts/:id", (req, res) => {
  if (!req.params) {
    return res
      .status(404)
      .send("BAD_REQUEST\n잘못된 요청입니다. 삭제할 게시글을 확인해주세요.");
  }
  const deleteData = data.posts.find((item) => item.id == req.params.id);
  deleteData.is_delete = true;
  console.log("삭제 posts db: ", deleteData);
  res.send(deleteData);
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중!!!!!!!!!!!");
});
