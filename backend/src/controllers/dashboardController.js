function recentUpdateRow(moduleName, label, row) {
  return {
    module: moduleName,
    title: label,
    status: row.status,
    updatedAt: row.updated_at || row.created_at,
  };
}

export async function getDashboard(req, res, next) {
  try {
    const pool = req.app.locals.pool;
    const [counts] = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM results) AS totalResults,
        (SELECT COUNT(*) FROM gallery) AS totalGalleryImages,
        (SELECT COUNT(*) FROM press_releases) AS totalPressReleases,
        (SELECT COUNT(*) FROM blogs) AS totalBlogs,
        (SELECT COUNT(*) FROM hero_sections) AS totalHeroBanners
    `);

    const [heroRows] = await pool.query(
      "SELECT id, title, status, created_at, updated_at FROM hero_sections ORDER BY updated_at DESC LIMIT 5",
    );
    const [resultRows] = await pool.query(
      "SELECT id, student_name, exam_label, status, created_at, updated_at FROM results ORDER BY updated_at DESC LIMIT 5",
    );
    const [galleryRows] = await pool.query(
      "SELECT id, title, status, created_at, updated_at FROM gallery ORDER BY updated_at DESC LIMIT 5",
    );
    const [pressRows] = await pool.query(
      "SELECT id, title, status, created_at, updated_at FROM press_releases ORDER BY updated_at DESC LIMIT 5",
    );
    const [blogRows] = await pool.query(
      "SELECT id, title, status, created_at, updated_at FROM blogs ORDER BY updated_at DESC LIMIT 5",
    );

    const recentUpdates = [
      ...heroRows.map((row) => recentUpdateRow("Hero", row.title, row)),
      ...resultRows.map((row) => recentUpdateRow("Result", `${row.student_name} - ${row.exam_label}`, row)),
      ...galleryRows.map((row) => recentUpdateRow("Gallery", row.title, row)),
      ...pressRows.map((row) => recentUpdateRow("Press Release", row.title, row)),
      ...blogRows.map((row) => recentUpdateRow("Blog", row.title, row)),
    ]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10);

    return res.json({
      totals: {
        results: Number(counts[0].totalResults || 0),
        galleryImages: Number(counts[0].totalGalleryImages || 0),
        pressReleases: Number(counts[0].totalPressReleases || 0),
        blogs: Number(counts[0].totalBlogs || 0),
        heroBanners: Number(counts[0].totalHeroBanners || 0),
      },
      recentUpdates,
    });
  } catch (error) {
    return next(error);
  }
}
