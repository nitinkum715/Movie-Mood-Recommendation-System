import { db } from "hatchable";
export const access="public"; export const methods=["GET"];
export default async function(req,res){
 const id=req.query?.id;if(!id)return res.status(400).json({error:"Movie id required"});
 const q=await db.query("SELECT m.*,COALESCE(AVG(r.rating),0)::numeric(3,2) AS user_avg,COUNT(r.review_id)::int AS review_count FROM movies m LEFT JOIN reviews r ON r.movie_id=m.movie_id WHERE m.movie_id=$1 GROUP BY m.movie_id",[id]);if(!q.rows[0])return res.status(404).json({error:"Movie not found"});
 const moods=await db.query("SELECT mo.mood_id,mo.mood_name FROM movie_mood mm JOIN moods mo ON mo.mood_id=mm.mood_id WHERE mm.movie_id=$1",[id]);
 const reviews=await db.query("SELECT r.review_id,r.rating,r.comment,r.review_date,u.name FROM reviews r JOIN users u ON u.user_id=r.user_id WHERE r.movie_id=$1 ORDER BY r.review_date DESC",[id]);
 res.json({...q.rows[0],moods:moods.rows,reviews:reviews.rows})
}