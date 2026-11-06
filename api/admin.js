import { db,auth } from "hatchable";
export const access="public"; export const methods=["GET","POST","PUT","DELETE"];
async function admin(req,res){const u=await auth.getUser(req);if(!u)return null;const q=await db.query("SELECT user_id,role FROM app_users WHERE auth_user_id=$1",[u.id]);if(q.rows[0]?.role!=="admin"){res.status(403).json({error:"Admin access required"});return null}return q.rows[0]}
export default async function(req,res){const a=await admin(req,res);if(!a)return;const b=req.body||{},action=String(b.action||req.query?.action||"");
 try{
 if(req.method==="GET"){const [m,u,r,mo]=await Promise.all([db.query("SELECT * FROM movies ORDER BY title"),db.query("SELECT user_id,name,email,role,created_at FROM users ORDER BY created_at DESC"),db.query("SELECT r.review_id,r.rating,r.comment,r.review_date,m.title,u.name FROM reviews r JOIN movies m ON m.movie_id=r.movie_id JOIN users u ON u.user_id=r.user_id ORDER BY r.review_date DESC"),db.query("SELECT * FROM moods ORDER BY mood_name")]);return res.json({movies:m.rows,users:u.rows,reviews:r.rows,moods:mo.rows})}
 if(action==="movie-delete"){await db.query("DELETE FROM movies WHERE movie_id=$1",[b.movie_id]);return res.json({ok:true})}
 if(action==="movie-save"){const q=await db.query("INSERT INTO movies(title,genre,language,release_year,rating,description,poster_url) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *",[b.title,b.genre,b.language,Number(b.release_year),Number(b.rating),b.description,b.poster_url]);return res.json(q.rows[0])}
 if(action==="movie-update"){const q=await db.query("UPDATE movies SET title=$1,genre=$2,language=$3,release_year=$4,rating=$5,description=$6,poster_url=$7 WHERE movie_id=$8 RETURNING *",[b.title,b.genre,b.language,Number(b.release_year),Number(b.rating),b.description,b.poster_url,b.movie_id]);return res.json(q.rows[0])}
 if(action==="mood-add"){const q=await db.query("INSERT INTO moods(mood_name) VALUES($1) ON CONFLICT DO NOTHING RETURNING *",[b.mood_name]);return res.json(q.rows[0]||null)}
 if(action==="mood-delete"){await db.query("DELETE FROM moods WHERE mood_id=$1",[b.mood_id]);return res.json({ok:true})}
 if(action==="mood-update"){const q=await db.query("UPDATE moods SET mood_name=$1 WHERE mood_id=$2 RETURNING *",[b.mood_name,b.mood_id]);return res.json(q.rows[0]||null)}
 if(action==="review-delete"){await db.query("DELETE FROM reviews WHERE review_id=$1",[b.review_id]);return res.json({ok:true})}
 if(action==="link"){await db.query("INSERT INTO movie_mood(movie_id,mood_id) VALUES($1,$2) ON CONFLICT DO NOTHING",[b.movie_id,b.mood_id]);return res.json({ok:true})}
 if(action==="unlink"){await db.query("DELETE FROM movie_mood WHERE movie_id=$1 AND mood_id=$2",[b.movie_id,b.mood_id]);return res.json({ok:true})}
 }catch(e){console.error(e);res.status(400).json({error:"Admin operation failed"})}
}