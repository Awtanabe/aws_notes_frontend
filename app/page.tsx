import { Post } from '@/types/post'

const PUBLIC_URL = process.env.NEXT_PUBLIC_URL || 'http://backend:8080';

async function getPosts(): Promise<Post[]> {
  try {
    const response = await fetch(`${PUBLIC_URL}/api/posts`, {
      cache: 'no-store', // SSRで常に最新データを取得
    });

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const posts = await response.json();
    return posts || [];
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default async function Home() {
  const posts = await getPosts()

  return (
    <div className="container">
      <div className="header">
        <h1>ブログ</h1>
      </div>

      <div className="posts-list">
        {posts.length === 0 ? (
          <div className="loading">投稿がありません</div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="post-image"
                />
              )}
              <h2 className="post-title">{post.title}</h2>
              <p className="post-content">{post.content}</p>
              <p className="post-date">
                投稿日: {formatDate(post.created_at)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
