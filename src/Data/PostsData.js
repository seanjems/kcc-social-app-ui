import posts from "../api/posts";
import postPic1 from "../img/postpic1.JPG";
import postPic2 from "../img/postpic2.JPG";
import postPic3 from "../img/postpic3.JPG";

const fetchPostsPaged = async (page, userProfileId) => {
  console.log("Sending post request with profileId", userProfileId);
  const result = await posts.tryGetAllPostPaged(page, userProfileId);
  if (!result.ok) return [];

  console.log("fetch posts result", result.data);
  return result.data;

  // if (!result.ok) {
  //   setCreatePostFailed(true);
  //   setCreatePostErrors(result.data);
  //   return;
  // }

  //add to posts array
};

const PostsData = (page = 1, userProfileId = null) => {
  console.log("received userId for post", userProfileId);
  return fetchPostsPaged(page, userProfileId);
};
export default PostsData;
// [
//   {
//     img: postPic1,
//     name: "Becky Atukwase",
//     likes: 2300,
//     desc: "We have an anchor that keeps the storm, steadfast and sure like the billows roll",

//     liked: true,
//   },
//   {
//     img: postPic2,
//     name: "Wabuyaka David",
//     likes: 2100,
//     desc: "A day like no other that the Lord has made",

//     liked: true,
//   },
//   {
//     img: postPic3,
//     name: "Tanga Jonathan",
//     likes: 15,
//     desc: "Happy sabbath to you all",
//     liked: false,
//   },
//   {
//     name: "Muhame Francis Jonathan",
//     likes: 15,
//     desc: "This is a nice post without an image but with a message to wish you a wonderful and blessed week.",
//     liked: false,
//   },
// ];
