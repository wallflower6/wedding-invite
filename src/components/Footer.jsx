import { CONFIG } from '../config'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="seal">囍</div>
      <div>{CONFIG.footerNames}</div>
    </footer>
  )
}
