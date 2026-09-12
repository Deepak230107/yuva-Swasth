import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reviews, hospitals, pharmacies } from "@/db/schema";
import { eq, and, avg } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const entityType = searchParams.get("entityType");
    const entityId = searchParams.get("entityId");

    if (!entityType || !entityId) {
      return NextResponse.json({ error: "entityType and entityId required" }, { status: 400 });
    }

    const all = await db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.entityType, entityType),
          eq(reviews.entityId, parseInt(entityId))
        )
      );

    return NextResponse.json({ reviews: all });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { entityType, entityId, reviewerName, rating, comment } = body;

    if (!entityType || !entityId || !reviewerName || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const [newReview] = await db
      .insert(reviews)
      .values({
        entityType,
        entityId: parseInt(entityId),
        reviewerName,
        rating: parseInt(rating),
        comment: comment || null,
      })
      .returning();

    // Recalculate average rating
    const allReviews = await db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.entityType, entityType),
          eq(reviews.entityId, parseInt(entityId))
        )
      );

    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    if (entityType === "hospital") {
      await db
        .update(hospitals)
        .set({
          rating: Math.round(avgRating * 10) / 10,
          totalReviews: allReviews.length,
        })
        .where(eq(hospitals.id, parseInt(entityId)));
    } else if (entityType === "pharmacy") {
      await db
        .update(pharmacies)
        .set({
          rating: Math.round(avgRating * 10) / 10,
          totalReviews: allReviews.length,
        })
        .where(eq(pharmacies.id, parseInt(entityId)));
    }

    return NextResponse.json({ review: newReview }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
