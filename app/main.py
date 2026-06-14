from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Reindex Game Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"
DATA_DIR = BASE_DIR / "data"

app.mount("/css", StaticFiles(directory=FRONTEND_DIR / "css"), name="css")
app.mount("/js", StaticFiles(directory=FRONTEND_DIR / "js"), name="js")
app.mount("/assets", StaticFiles(directory=FRONTEND_DIR / "assets"), name="assets")
app.mount("/data", StaticFiles(directory=DATA_DIR), name="data")


@app.get("/")
async def read_index():
  return FileResponse(FRONTEND_DIR / "index.html")


@app.get("/prologue")
async def read_prologue():
  return FileResponse(FRONTEND_DIR / "prologue.html")


@app.get("/chapter/1", response_class=HTMLResponse)
async def read_chapter_one():
  chapter_path = FRONTEND_DIR / "chapter1.html"

  if chapter_path.exists():
    return FileResponse(chapter_path)

  return HTMLResponse(
    """
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <title>Reindex - Chapter 1</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" href="/css/main.css" />
    </head>
    <body>
      <div style="padding:40px; color:#d7dde4; background:#04070c; min-height:100vh; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        <h1 style="margin-top:0;">Chapter 1 placeholder</h1>
        <p>frontend/chapter1.html 파일이 아직 없습니다.</p>
        <p>파일을 생성하면 이 임시 화면 대신 실제 챕터가 열립니다.</p>
        <p><a href="/" style="color:#7ad7e0; text-decoration:none;">← 메인 메뉴로 돌아가기</a></p>
      </div>
    </body>
    </html>
    """
  )


@app.get("/health")
async def health_check():
  return {"status": "ok", "service": "reindex-backend"}