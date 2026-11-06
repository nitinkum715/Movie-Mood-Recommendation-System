import { db, auth } from "hatchable";
export const access="public"; export const methods=["GET","POST"];
export default async function(req,res){
 const u=await auth.getUser(req); if(!u)return res.status(401).json({error:"Sign in required"});
 if(req.method==="GET"){const q=await db.query("SELECT user_id,name,email,role FROM app_users WHERE auth_user_id=$1",[u.id]);return res.json(q.rows[0]||null)}
 const b=req.body||{},name=String(b.name||u.name||"Movie Fan").trim().slice(0,100); if(!name)return res.status(400).json({error:"Name required"});
 const existing=await db.query("SELECT user_id,name,email,role FROM users WHERE auth_user_id=$1",[u.id]); if(existing.rows[0])return res.json(existing.rows[0]);
 const count=await db.query("SELECT COUNT(*)::int AS n FROM users"); const role=count.rows[0].n===0?"admin":"user";
 const q=await db.query("INSERT INTO app_users(auth_user_id,name,email,role) VALUES($1,$2,$3,$4) RETURNING user_id,name,email,role",[u.id,name,u.email,role]); res.json(q.rows[0])
}