import { db,auth } from "hatchable";
export const access="public"; export const methods=["GET","POST"];
export default async function(req,res){const u=await auth.getUser(req);if(!u)return res.status(401).json({error:"Sign in required"});const me=await db.query("SELECT user_id FROM app_users WHERE auth_user_id=$1",[u.id]);if(!me.rows[0])return res.status(400).json({error:"Create your profile first"});const uid=me.rows[0].user_id;
 if(req.method==="POST"){const q=await db.query("INSERT INTO watch_history(user_id,movie_id) VALUES($1,$2) ON CONFLICT(user_id,movie_id) DO UPDATE SET watched_date=now() RETURNING *",[uid,req.body.movie_id]);return res.json(q.rows[0])}
 const q=await db.query("SELECT h.watched_date,m.* FROM watch_history h JOIN movies m ON m.movie_id=h.movie_id WHERE h.user_id=$1 ORDER BY h.watched_date DESC",[uid]);res.json(q.rows)
}