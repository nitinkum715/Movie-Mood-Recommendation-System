import { db,auth } from "hatchable";
export const access="public"; export const methods=["POST","PUT","DELETE"];
export default async function(req,res){
 const u=await auth.getUser(req);if(!u)return res.status(401).json({error:"Sign in required"});
 const me=await db.query("SELECT user_id FROM app_users WHERE auth_user_id=$1",[u.id]);if(!me.rows[0])return res.status(400).json({error:"Create your profile first"});const uid=me.rows[0].user_id,b=req.body||{};
 if(req.method==="POST"){const q=await db.query("INSERT INTO reviews(user_id,movie_id,rating,comment) VALUES($1,$2,$3,$4) ON CONFLICT(user_id,movie_id) DO UPDATE SET rating=EXCLUDED.rating,comment=EXCLUDED.comment,review_date=now() RETURNING *",[uid,b.movie_id,Number(b.rating),String(b.comment||"").slice(0,1000)]);return res.json(q.rows[0])}
 if(req.method==="PUT"){const q=await db.query("UPDATE reviews SET rating=$1,comment=$2,review_date=now() WHERE review_id=$3 AND user_id=$4 RETURNING *",[Number(b.rating),String(b.comment||"").slice(0,1000),b.review_id,uid]);return res.json(q.rows[0]||null)}
 const q=await db.query("DELETE FROM reviews WHERE review_id=$1 AND user_id=$2",[b.review_id,uid]);res.json({deleted:q.rowCount})
}