import { logOut } from '@/services/firebase'

function AdminPanel() {
  return (
    <div>
      <button onClick={logOut}>
        Sign Out
      </button>
    </div>
  )
}

export default AdminPanel