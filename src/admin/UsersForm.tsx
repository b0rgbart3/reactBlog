'use client';
import { useStore } from "../state/useStore";

export function UsersForm() {
  const { user, users } = useStore((s) => s);
  const adminCount = users.filter((u) => u.sensi).length;
  return (
    user.sensi && (
      <>
        <div className="bMeta">
          {users.length} users &nbsp; &nbsp; | &nbsp; &nbsp; {adminCount} admin
        </div>
        {users.map((u) => (
          <div className="bUser" key={u._id}>
            <div className="bUserHeader">
              {u.userName || (
                <span style={{ opacity: 0.4, fontStyle: "italic" }}>unnamed</span>
              )}
            </div>
            <div className="bRow"><div className="bLabel">ID</div><div className="bItem bHash">{u._id}</div></div>
            <div className="bRow"><div className="bLabel">Email</div><div className="bItem">{u.userEmail}</div></div>
            <div className="bRow">
              <div className="bLabel">Status</div>
              <div className="bItem">{u.status ? <span className="bBadge bBadge-active">{u.status}</span> : null}</div>
            </div>
            <div className="bRow">
              <div className="bLabel">Author</div>
              <div className="bItem"><span className={`bBadge ${u.author ? "bBadge-true" : "bBadge-false"}`}>{u.author ? "true" : "false"}</span></div>
            </div>
            <div className="bRow">
              <div className="bLabel">Sensi</div>
              <div className="bItem"><span className={`bBadge ${u.sensi ? "bBadge-true" : "bBadge-false"}`}>{u.sensi ? "true" : "false"}</span></div>
            </div>
            <div className="bRow"><div className="bLabel">Hash</div><div className="bItem bHash">{u.phash}</div></div>
          </div>
        ))}
      </>
    )
  );
}
