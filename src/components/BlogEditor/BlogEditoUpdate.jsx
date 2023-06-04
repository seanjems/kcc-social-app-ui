import React, { useContext, useState } from "react";
import { Modal, Button } from "@mantine/core";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import BlogSingle from "./Blogsingle";
import "./BlogEditor.css";
import { TextInput, Image } from "@mantine/core";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";

import AuthContext from "../../auth/context";
import { showNotification, updateNotification } from "@mantine/notifications";
import articles from "../../api/articles";
import { IconX, IconCheck } from "@tabler/icons";

const BlogPostFormUpdate = (activeArticle = null) => {
  const [content, setContent] = useState(activeArticle?.content);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const userContext = useContext(AuthContext);

  const [title, setTitle] = useState(activeArticle?.articleTitle);
  const [isValidated, setIsValidated] = useState(true);
  const [uploadFile, setUploadFile] = useState();

  const [tags, setTags] = useState(activeArticle?.tags ?? []);
  const [coverImage, setCoverImage] = useState(activeArticle?.coverImage);
  const [authorName, setAuthorName] = useState(activeArticle?.authorName);
  const [authorTitle, setAuthorTitle] = useState(activeArticle?.authorTitle);
  const [validationErrors, setValidationErrors] = useState("");
  const articleObj = {
    content: content,
    coverImage: coverImage,
    tags: tags,
    authorId: 1,
    autherName: authorName,
    articleTitle: title,
    autherTitle: authorTitle,
    authorProfileUrl:
      "ttps://www.seekpng.com/png/detail/143-1435868_headshot-silhouette-person-placeholder.png",
  };

  const user = userContext.user;
  // console.log("🚀 ~ file: BlogEditor.jsx:41 ~ BlogPostForm ~ user:", user);
  const handleContentChange = (value) => {
    setContent(value);
  };

  const handlePreviewClick = () => {
    setPreviewModalOpen(true);
  };

  const handlePreviewClose = () => {
    setPreviewModalOpen(false);
  };

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ color: [] }],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      [{ script: "sub" }, { script: "super" }],
      ["code"],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleCoverImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCoverImage(reader.result);
      };
      setUploadFile(file);
      reader.readAsDataURL(file);
    }
  };

  const handleAuthorNameChange = (event) => {
    setAuthorName(event.target.value);
  };

  const handleAuthorTitleChange = (event) => {
    setAuthorTitle(event.target.value);
  };
  const handleValidation = () => {
    let status = true;
    let valMessage = "";
    if (!articleObj.articleTitle) {
      console.log(
        "🚀 ~ file: BlogEditor.jsx:110 ~ handleValidation ~ !articleObj.title:",
        articleObj
      );
      valMessage += "A title is required \n";
      status = false;
    }
    if (articleObj?.title && articleObj?.articleTitle.length < 5) {
      valMessage += "Your Title is too short \n";
      status = false;
    }
    if (articleObj?.tags?.length == 0) {
      valMessage += "Please create atleast 1 tag/category for your article \n";
      status = false;
    }
    if (!articleObj.coverImage) {
      valMessage += "Cover Image for the article is required. \n";
      status = false;
    }
    if (!articleObj.content) {
      valMessage += "Please add Article content. \n";
      status = false;
    }

    if (articleObj.content && articleObj.content?.length < 500) {
      valMessage += "Article is too short. Please add more content \n";
      status = false;
    }

    if (!articleObj.autherTitle) {
      valMessage += "Author title is required \n";
      status = false;
    }
    setValidationErrors(valMessage);
    setIsValidated(status);
    return status;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      console.log(articleObj);
      var formData = new FormData();
      formData.append("imageFile", uploadFile);
      formData.append("AuthorName", articleObj.autherName);
      formData.append("ArticleTitle", articleObj.articleTitle);
      formData.append("AuthorTitle", articleObj.autherTitle);
      formData.append("Content", articleObj.content);
      formData.append("Tags", articleObj.tags);
      //validate passwords

      //close modal if open
      showNotification({
        id: "save-data",
        loading: true,
        title: "Posting",
        message: "Please wait...",
        autoClose: false,
        disallowClose: true,
        style: { zIndex: "999999" },
      });
      //call api
      const result = await articles.tryCreateArticle(formData);

      if (!result.ok) {
        // setCreatePostFailed(true);
        // setCreatePostErrors(result.data);
        setTimeout(() => {
          updateNotification({
            id: "save-data",
            color: "red",
            title: "Error while submiting post",
            message: `${result?.status} ${result.problem}`,
            icon: <IconX size={16} />,
            autoClose: 6000,
            style: { zIndex: "99999999" },
          });
        }, 3000);

        return;
      }

      setTimeout(() => {
        updateNotification({
          id: "save-data",
          color: "green",
          title: "Article Submitted",
          message: `Your article will be published after review.`,
          icon: <IconCheck size={16} />,
          autoClose: 6000,
          style: { zIndex: "99999999" },
        });
      }, 3000);
    } else {
      console.log(validationErrors);
    }
  };
  return (
    <div style={{ marginBottom: "2rem" }}>
      <div>
        <p>
          Thank you for contributing an article to SDA Kampala Central Church.
          We value your input and appreciate your willingness to share your
          thoughts and ideas with us. Please note that your article will undergo
          review and editing before it is published on the main church website.
          We will notify you once your article has been approved and published.
          Thank you again for your contribution to our church community.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Article Title"
          defaultValue={title}
          onChange={handleTitleChange}
        />

        <div style={{ marginTop: "1rem" }}>
          <label htmlFor="tagsEditor">Add Article tags/Categories</label>

          <TagsInput value={tags} onChange={(tag) => setTags(tag)} />
        </div>
        <div style={{ marginTop: "1rem" }}>
          <div>
            <input type="file" defa onChange={handleCoverImageChange} />
          </div>
          {coverImage ? (
            <Image src={coverImage} width="100%" height={400} />
          ) : (
            ""
          )}
        </div>
        <br />
        <label htmlFor="contentEditor">Article content</label>
        <div
          style={{
            border: "solid 1px gray",
            borderRadius: "1rem",
            overflow: "scroll",
            minHeight: "15rem", // Set a minimum height for the div
          }}
        >
          <ReactQuill
            modules={modules}
            value={content}
            onChange={handleContentChange}
            formats={formats}
          />
        </div>
        <div style={{ marginTop: "1rem" }}>
          <TextInput
            label="Author Name"
            value={user.FullName}
            onChange={handleAuthorNameChange}
          />
          <TextInput
            label="Author Title"
            value={authorTitle}
            onChange={handleAuthorTitleChange}
          />
        </div>
        <div>
          {!isValidated && (
            <label htmlFor="validationErrors" style={{ color: "red" }}>
              {validationErrors.split("\n").map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </label>
          )}
        </div>
        <div style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
          <Button variant="outline" onClick={handlePreviewClick}>
            Preview
          </Button>
          <Button variant="outline" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </form>

      <Modal
        title="Article Preview"
        opened={previewModalOpen}
        onClose={handlePreviewClose}
        size="75%"
      >
        <BlogSingle ArticleObj={articleObj} />
      </Modal>
    </div>
  );
};

export default BlogPostFormUpdate;
