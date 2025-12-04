async function getPosts() {
  const res = await fetch("http://localhost:8000/api/posts/", {
    cache: "no-store",
  });
  return res.json();
}

export default async function BlogPage() {
  return (
    <>

    

    </>
  );
}
