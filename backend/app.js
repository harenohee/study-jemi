const express = require("express");
// const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("port", process.env.PORT || 3000);

// 게시판 and 게시글 공개-비공개 enum
const PRIVACY = {
  PUBLIC: "public",
  SECRET: "secret",
};

// 테스트 db
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
      is_delete: false,
    },
  ],
};

// boards- 전체 게시판 조회
app.get("/boards", (req, res) => {
  res.send(data.boards);
});

// board 생성
app.post("/boards", (req, res) => {
  console.log("마지막 id값: ", data.boards[data.boards.length - 1].id);
  let currentId = data.boards[data.boards.length - 1].id;
  const newBoard = {
    id: currentId + 1,
    name: "테스트",
    privacy: PRIVACY.SECRET,
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
  console.log("삭제 id: ", req.params.id);
  const deleteData = data.boards.map((item) => {
    if (item.id == req.params.id) {
      return { ...item, is_delete: !item.is_delete };
    }
    return item;
  });
  console.log("삭제 후 db: ", deleteData);
  res.send(deleteData);
  // res.send(console.log(deleteData));
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중!!!!!!!!!!!");
});
