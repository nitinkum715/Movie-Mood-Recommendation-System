import { db } from "hatchable";
export const access="public"; export const methods=["GET"];
export default async function(req,res){const q=await db.query("SELECT mo.mood_id,mo.mood_name,COUNT(mm.movie_id)::int AS movie_count FROM moods mo LEFT JOIN movie_mood mm ON mm.mood_id=mo.mood_id GROUP BY mo.mood_id ORDER BY mo.mood_name");res.json(q.rows)}