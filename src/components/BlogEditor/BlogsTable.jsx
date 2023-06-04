import React, { useState, useEffect } from "react";
import { Table } from "@mantine/core";
import axios from "axios";
import articles from "../../api/articles";
import { IconX, IconEdit, IconTrash, IconSend } from "@tabler/icons";
import { showNotification } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";

function BlogTable() {
  const [blogs, setBlogs] = useState([]);
  console.log("🚀 ~ file: BlogsTable.jsx:10 ~ BlogTable ~ blogs:", blogs);
  const [page, setPage] = useState(1);
  const [numberPerPage, setNumberPerPage] = useState(20);
  const navigate = useNavigate();
  useEffect(() => {
    fetchAllArticlesPerUser();
  }, []);

  function handleEditBlog(blog) {
    // Implement edit logic here
  }

  async function fetchAllArticlesPerUser() {
    // Implement edit logic here
    const result = await articles.tryGetAllPerUser(page, numberPerPage);
    if (!result.ok) {
      // setCreatePostFailed(true);
      // setCreatePostErrors(result.data);
      setTimeout(() => {
        showNotification({
          id: "save-data",
          color: "red",
          title: "Error",
          message: `${result?.status} ${result.problem}`,
          icon: <IconX size={16} />,
          autoClose: 6000,
          style: { zIndex: "99999999" },
        });
      }, 3000);

      return;
    }
    setBlogs(result.data);
  }

  function handleDeleteBlog(blog) {
    // Implement delete logic here
  }

  function handleSubmitBlog(blog) {
    // Implement submit logic here
  }

  function createOptionButtons(blog) {
    const optionButtons = [];

    optionButtons.push(<IconEdit onClick={() => handleEditBlog(blog)} />);

    optionButtons.push(<IconTrash onClick={() => handleDeleteBlog(blog)} />);

    if (blog.status !== "active") {
      optionButtons.push(<IconSend onClick={() => handleSubmitBlog(blog)} />);
    }

    return optionButtons;
  }

  return (
    <>
      <div className="container">
        <h2>Articles</h2>
        <p>
          Welcome to SDA Kampala Central's article submission platform! Here,
          you have the opportunity to create, edit and submit detailed and
          fact-rich articles that will be published on our main church website.
          Share your message, sermons, advice, or findings with a wider audience
          through this platform. We value your input and every article submitted
          will undergo thorough review before being published on our website.
          Start sharing your thoughts and ideas with the world today!
        </p>
      </div>
      <div className="m-2 d-flex flex-row-reverse">
        <button
          onClick={() => navigate(`/article/create`)}
          className="btn button"
          style={{ color: "white" }}
        >
          Create
        </button>
      </div>
      <Table striped highlightOnHover withBorder withColumnBorders>
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Author</th>
            <th>Status</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {blogs.length ? (
            blogs.map((blog, key) => (
              <tr key={key}>
                <td>{new Date(blog.createdAt).toLocaleString("en-US")}</td>
                <td>{blog.articleTitle}</td>
                <td>{blog.authorName}</td>
                <td>{blog.status ?? "Pending"}</td>
                <td>{createOptionButtons(blog)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td>You have no Articles. Create one.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
}

export default BlogTable;
