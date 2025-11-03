'use client'

import { useEffect, useState } from 'react'

interface Post {
  id: number
  title: string
  content: string
  image_url: string
  created_at: string
  updated_at: string
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://aws-notes-alb-981637013.ap-northeast-1.elb.amazonaws.com/api/posts')
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }
      const data = await response.json()
      setPosts(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
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

  return (
    <div className="container">
      <div className="header">
        <h1>ブログ</h1>
      </div>

      {error && (
        <div className="error">
          エラー: {error}
        </div>
      )}

      {loading ? (
        <div className="loading">読み込み中...</div>
      ) : (
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
      )}
    </div>
  )
}
