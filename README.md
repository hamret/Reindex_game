# Reindex

> *죽음은 더 이상 끝이 아니게 되었다.*
> **Reindex Institute.**

***

## 📖 게임 소개

**Reindex**는 선택지 기반 인터랙티브 스토리 + 복구(기록 편집) 메인 루프 장르의 게임입니다.

인류는 육신 복원 기술을 완성해 죽은 사람의 몸을 되살릴 수 있게 되었지만, 기억과 정신은 온전히 돌아오지 않습니다. 플레이어는 **Reindex Institute**의 복구연구자로서, 사망자의 데이터 조각을 추출하고 처리하여 복구안을 완성해야 합니다.

- **플레이 시간**: 약 1시간 내외

***

## 🎮 게임플레이 구조

게임은 두 가지 모드로 구성됩니다.

### 복구 파트 (업무/시스템 플레이)
사망자의 데이터를 수집·열람하고, 각 기억 조각을 처리하는 파트입니다. UI는 업무용 패널·기록 카드·분석 화면 형태로 구성됩니다.

| 처리 방식 | 설명 |
|--------|------|
| **삭제** | 해당 데이터를 복구 자아에 포함하지 않음 |
| **업로드** | 대상자의 공식 기억·정체성으로 채택 |
| **결합** | 충돌하는 두 조각을 하나의 서사로 통합 |
| **보류** | 판정을 유예하고 후속 처리로 넘김 |

### 스토리 파트 (서사/관계 플레이)
복구 결과를 마주하고 인물들과 상호작용하며 서사를 진행하는 파트입니다. 대사 선택·내레이션·탐색 중심으로 구성됩니다.

***

## 📊 카르마 / 가치 시스템

선악 점수가 아닌 **복구 철학**을 쌓는 4축 스탯입니다.

| 축 | 의미 |
|----|------|
| **truth** | 불편한 진실도 남기려는 성향 |
| **stability** | 사회적으로 안정된 자아를 우선하는 성향 |
| **mercy** | 당사자의 고통을 덜어주려는 성향 |
| **compliance** | 기관과 AI의 권고를 따르는 성향 |

각 선택지는 이 중 1~2개 축을 ±1/±2 정도로 변화시키며, 즉각적인 장면 반응과 후반 엔딩 모두에 반영됩니다.

***

## 🗂️ 챕터 구성

총 6챕터 + 조건 충족 시 진입 가능한 히든 챕터로 구성됩니다.

| 챕터 | 역할 |
|------|------|
| 1 | 세계관·AI 소개, 기본 복구 루프 튜토리얼 |
| 2 | 4축 스탯 첫 체감, 일상 케이스 처리 |
| 3 | 위화감 강화, 과거의 그림자 |
| 4 | 시스템의 진실 1단계 공개 |
| 5 | 누적 선택의 결과 회수 |
| 6 | 최종 복구 + 엔딩 분기 |
| 7 | 히든 루트 전용 |

***

## 🛠️ 기술 스택

| 구분 | 내용 |
|------|------|
| **백엔드** | Python 3.11.x, FastAPI, Uvicorn |
| **프론트엔드** | HTML / CSS / JavaScript |
| **데이터 형식** | JSON |
| **AI 연동** | Groq API (BYOK 방식) |
| **개발 환경** | PyCharm |
| **패키징** | Electron (우선순위), pywebview + PyInstaller (대안) |

***

## 📦 설치 및 실행

### 요구사항

- Python 3.11.x
- Node.js (Electron 패키징 시)
- Groq API Key ([console.groq.com](https://console.groq.com) 에서 발급)

### 설치

```bash
git clone https://github.com/your-username/reindex.git
cd reindex
pip install -r requirements.txt
```

### 환경 변수 설정

```bash
cp .env.example .env
# .env 파일에 GROQ_API_KEY 입력
```

### 실행

```bash
uvicorn app.main:app --reload
```

브라우저에서 `http://localhost:8000` 접속

***

## 📁 폴더 구조

```
reindex/
├─ app/
│  ├─ main.py
│  ├─ api/
│  ├─ core/
│  ├─ models/
│  ├─ services/
│  └─ prompts/
├─ frontend/
│  ├─ index.html
│  ├─ css/
│  ├─ js/
│  └─ assets/
├─ data/
│  ├─ cases/
│  ├─ endings/
│  └─ flags/
├─ tests/
├─ .env
├─ requirements.txt
└─ README.md
```

***

## 📋 requirements.txt

```
fastapi
uvicorn[standard]
pydantic
python-dotenv
httpx
python-multipart
jinja2
aiofiles
pytest
pytest-asyncio
groq
```

***

## ⚙️ AI 연동 안내 (BYOK)

이 게임의 AI 기능은 사용자 개인 Groq API 키를 사용합니다.

1. [Groq Console](https://console.groq.com)에서 API Key를 발급받으세요
2. `.env` 파일에 아래와 같이 입력하세요

```
GROQ_API_KEY=your_key_here
```

3. 입력한 키는 로컬 환경에서만 사용되며, 외부로 전송되지 않습니다

***

## 🖥️ 패키징 (데스크톱 배포)

완성된 웹 게임은 **Electron**을 사용해 데스크톱 실행 파일(.exe)로 패키징할 예정입니다.

```bash
# Electron 빌드 예시
npm install
npm run build
```

대안으로 **pywebview + PyInstaller** 조합도 사용 가능합니다.

***

## 📝 개발 노트

씬 데이터는 아래 구조로 JSON 저장합니다.

```json
{
  "scene_id": "ch1-s1",
  "text": "...",
  "choices": [...],
  "karma_effect": { "truth": 1, "stability": -1 },
  "immediate_result": "...",
  "flags_set": [...],
  "next_scene": "ch1-s2"
}
```

카르마 설계 원칙:
- 한 선택지는 최대 2개 축만 크게 이동
- "무조건 좋은 선택"은 없음
- `truth`↑ → `stability`↓ 가능성 높음
- `compliance`↑ → 단기 성과 좋으나 후반 정보 접근 감소