import os
with open("server/prisma/schema.prisma", "a") as f:
    f.write("""

// ============================================================
// 11. HEALTH VIDEOS (SUPER_ADMIN MANAGED)
// ============================================================

enum VideoStatus {
  DISCOVERED
  PENDING_REVIEW
  APPROVED
  DISABLED
  DELETED
}

model HealthTopic {
  id             String             @id @default(cuid())
  topicKey       String             @unique
  displayName    String
  description    String?            @db.Text
  searchKeywords String             @default("[]")
  hashtags       String             @default("[]")
  enabled        Boolean            @default(true)
  createdAt      DateTime           @default(now())
  updatedAt      DateTime           @updatedAt

  videos         HealthVideoTopic[]
}

model HealthVideo {
  id              String               @id @default(cuid())
  youtubeVideoId  String               @unique
  title           String
  description     String?              @db.Text
  channelName     String?
  durationSeconds Int                  @default(0)
  keywords        String               @default("[]")
  hashtags        String               @default("[]")
  status          VideoStatus          @default(PENDING_REVIEW)
  enabled         Boolean              @default(false)
  displayOrder    Int                  @default(0)
  createdBy       String? // Admin userId who added it, or 'SYSTEM' if discovered
  approvedBy      String? // Admin userId who approved it
  approvedAt      DateTime?
  createdAt       DateTime             @default(now())
  updatedAt       DateTime             @updatedAt

  topics          HealthVideoTopic[]
  history         HealthVideoHistory[]
}

model HealthVideoTopic {
  videoId String
  topicId String
  video   HealthVideo @relation(fields: [videoId], references: [id], onDelete: Cascade)
  topic   HealthTopic @relation(fields: [topicId], references: [id], onDelete: Cascade)

  @@id([videoId, topicId])
}

model HealthVideoHistory {
  id            String      @id @default(cuid())
  videoId       String
  video         HealthVideo @relation(fields: [videoId], references: [id], onDelete: Cascade)
  adminUserId   String
  action        String
  previousValue String?     @db.Text
  newValue      String?     @db.Text
  timestamp     DateTime    @default(now())
  undoStatus    Boolean     @default(false)
}
""")
