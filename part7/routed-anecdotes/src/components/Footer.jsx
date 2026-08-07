const Footer = () => {
  const footerStyle = {
    marginTop: '20px',
    paddingTop: '10px',
    borderTop: '1px solid #ccc'
  }

  return (
    <div style={footerStyle}>
      Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.
      <br />
      See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes</a> for the source code.
    </div>
  )
}

export default Footer