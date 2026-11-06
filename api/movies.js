import { db } from "hatchable";
export const access="public"; export const methods=["GET"];
export default async function(req,res){
 const q=req.query||{},params=[],where=[]; let i=1;
 if(q.search){where.push("m.title ILIKE $"+i++);params.push("%"+String(q.search)+"%")}
 if(q.genre){where.push("m.genre ILIKE $"+i++);params.push("%"+String(q.genre)+"%")}
 if(q.language){where.push("m.language=$"+i++);params.push(String(q.language))}
 if(q.year){where.push("m.release_year=$"+i++);params.push(Number(q.year))}
 if(q.min_rating){where.push("m.rating >= $"+i++);params.push(Number(q.min_rating))}
 if(q.mood){where.push("EXISTS (SELECT 1 FROM movie_mood mm JOIN moods md ON md.mood_id=mm.mood_id WHERE mm.movie_id=m.movie_id AND md.mood_name=$"+i+++")");params.push(String(q.mood))}
 const sql="SELECT m.*,COALESCE(AVG(r.rating),0)::numeric(3,2) AS user_avg,COUNT(r.review_id)::int AS review_count FROM movies m LEFT JOIN reviews r ON r.movie_id=m.movie_id "+(where.length?"WHERE "+where.join(" AND "):"")+" GROUP BY m.movie_id ORDER BY m.rating DESC,m.title LIMIT 100";
 const out=await db.query(sql,params);res.json(out.rows)
}