import type { Locale } from '../../i18n'

type Session = {
  name: string
  agent: string
  state: string
  tone: 'progress' | 'caution' | 'neutral' | 'danger' | 'success'
  live?: boolean
  message: string
  context: number
  turns: number
  tools: number
  tokens: string
  elapsed: string
  directory: string
  started: string
  turnsLog: {
    title: string
    time: string
    dateTime: string
    status: string
    tone: 'progress' | 'success' | 'danger' | 'caution' | 'neutral'
    reply?: string
    tools: string
  }[]
}

const en = {
  intro:
    'A collection shows like items side by side, such as sessions, hosts or deployments, as cards in a Grid. People compare the cards across a row, so every card shows the same parts in the same places, and the grid fits the cards to the room it has.',
  rulesLabel: 'Collection card rules',
  rulesCaption: 'Where each part of a collection card goes',
  partHeader: 'Part',
  ruleHeader: 'Rule',
  rules: [
    [
      'Columns',
      "Grid columns='auto' min='card': as many columns as fit the grid's own width, each at least 20rem. min='tile' fits a figure and its label, min='brief' a card of a name and a line or two, min='wide' a chart. A fixed count follows the window, so beside a sidebar or in a panel its cards get squeezed.",
    ],
    [
      'Padding and gaps',
      "The card's own padding and the grid's gap, both from density: compact on the region sets cards 12px apart with 12px inside. Don't pad or space single cards.",
    ],
    [
      'Header',
      "Who it is: an Avatar colored by categoryFor(name), the title with Card.Action, a muted line of metadata, and one StatusBadge. The row keeps one line, Inline wrap={false}: a long name cuts short with Card.Title lines={1}, and the badge keeps its place, so every card keeps the header's height.",
    ],
    [
      'State',
      'One StatusBadge says the state in words. Avatar.Status live marks only the items working right now. No colored bands, borders or tinted cards: a state is a point on the card, not its plane.',
    ],
    [
      'Body',
      'The text that varies, such as the last message, in Text lines={2}, so every body takes the same height. The whole text shows where the card opens.',
    ],
    [
      'Footer',
      'Parts of a fixed height: a Meter takes a line of its own, then one row of small Stats in a Stat.Group, about four at the card minimum. The footer sits at the bottom, so footers line up across a row.',
    ],
    [
      'Missing values',
      'Keep the part and show 0 or a dash, so the parts after it stay in place.',
    ],
    [
      'Details',
      'Card.Action opens a Sheet, which keeps the collection in view. A Dialog is for a task, such as renaming; a long history, such as every turn of a session, gets a page of its own.',
    ],
  ] as [string, string][],
  exampleLabel: 'Agent sessions',
  context: 'Context',
  contextText: (value: number) => `${value}% of the context window used`,
  countsLabel: 'Session counts',
  turns: 'Turns',
  tools: 'Tools',
  tokens: 'Tokens',
  elapsed: 'Time',
  closeSheet: (name: string) => `Close ${name}`,
  recentTurns: 'Recent turns',
  details: 'Details',
  directory: 'Directory',
  started: 'Started',
  agent: 'Agent',
  noValue: '—',
  sessions: [
    {
      name: 'platform-api',
      agent: 'Claude Code on devbox',
      state: 'Working',
      tone: 'progress',
      live: true,
      message:
        'Running the Playwright suite after the card footer change: 212 of 640 tests done, none failed so far.',
      context: 62,
      turns: 48,
      tools: 131,
      tokens: '1.2M',
      elapsed: '2h 14m',
      directory: '~/src/platform-api',
      started: 'Today, 09:12',
      turnsLog: [
        {
          title: 'Run the browser tests',
          time: '11:26',
          dateTime: '2026-11-08T11:26:00',
          status: 'Running',
          tone: 'progress',
          tools: 'Bash ×2',
        },
        {
          title: 'Move the footer to the bottom',
          time: '11:18',
          dateTime: '2026-11-08T11:18:00',
          status: 'Done',
          tone: 'success',
          reply:
            'The card is a column now, and its footer takes the space left at the bottom, so footers line up across a row.',
          tools: 'Read ×3 · Edit ×2 · Bash',
        },
        {
          title: 'Find why the footers drift',
          time: '11:02',
          dateTime: '2026-11-08T11:02:00',
          status: 'Done',
          tone: 'success',
          tools: 'Grep ×4 · Read ×6',
        },
      ],
    },
    {
      name: 'billing-worker',
      agent: 'Claude Code on nas',
      state: 'Needs input',
      tone: 'caution',
      message:
        'Asks to restart the worker container to load the new queue settings.',
      context: 38,
      turns: 12,
      tools: 40,
      tokens: '310K',
      elapsed: '41m',
      directory: '~/src/billing-worker',
      started: 'Today, 10:45',
      turnsLog: [
        {
          title: 'Restart the worker container',
          time: '11:24',
          dateTime: '2026-11-08T11:24:00',
          status: 'Waiting for approval',
          tone: 'caution',
          tools: 'Bash',
        },
      ],
    },
    {
      name: 'docs-site',
      agent: 'opencode on gpu-1',
      state: 'Idle',
      tone: 'neutral',
      message: 'Moved three panels to LineChart and updated their tests.',
      context: 88,
      turns: 95,
      tools: 284,
      tokens: '2.6M',
      elapsed: '5h 02m',
      directory: '~/src/docs-site',
      started: 'Today, 06:20',
      turnsLog: [
        {
          title: 'Update the panel tests',
          time: '11:10',
          dateTime: '2026-11-08T11:10:00',
          status: 'Done',
          tone: 'success',
          tools: 'Edit ×5 · Bash ×2',
        },
      ],
    },
    {
      name: 'search-indexer',
      agent: 'Claude Code on devbox',
      state: 'Failed',
      tone: 'danger',
      message:
        'The index token expired; the run stopped while fetching the second shard.',
      context: 14,
      turns: 6,
      tools: 9,
      tokens: '',
      elapsed: '8m',
      directory: '~/src/search-indexer',
      started: 'Today, 11:15',
      turnsLog: [
        {
          title: 'Fetch the second shard',
          time: '11:23',
          dateTime: '2026-11-08T11:23:00',
          status: 'Failed',
          tone: 'danger',
          reply: 'The index answered 401: the token has expired.',
          tools: 'Bash',
        },
      ],
    },
  ] as Session[],
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    intro:
      '컬렉션은 세션, 호스트, 배포처럼 비슷한 항목을 Grid 안의 카드로 나란히 보여 줍니다. 읽는 사람은 같은 줄의 카드를 서로 비교하므로, 모든 카드는 같은 부분을 같은 자리에 보여야 합니다. 그리드는 주어진 공간에 카드를 맞춥니다.',
    rulesLabel: '컬렉션 카드 규칙',
    rulesCaption: '컬렉션 카드의 각 부분이 들어갈 자리',
    partHeader: '부분',
    ruleHeader: '규칙',
    rules: [
      [
        '열',
        "Grid columns='auto' min='card'는 그리드 자체 너비에 들어오는 만큼 열을 두고, 각 열은 최소 20rem입니다. min='tile'은 수치와 그 레이블, min='brief'는 이름과 한두 줄을 담는 카드, min='wide'는 차트에 맞는 크기입니다. 고정 열 개수는 창 너비를 따르므로, 사이드바 옆이나 패널 안에서는 카드가 좁게 눌립니다.",
      ],
      [
        '패딩과 간격',
        '카드의 패딩과 그리드의 gap은 모두 밀도에서 나옵니다. 영역에 compact를 두면 카드는 서로 12px 떨어지고 안쪽 여백은 12px가 됩니다. 카드 하나하나에 패딩이나 간격을 따로 주지 마세요.',
      ],
      [
        '헤더',
        '누구인지를 보여 주는 자리입니다. categoryFor(name)이 고른 색의 Avatar, Card.Action이 들어 있는 제목, 흐린 색의 메타데이터 한 줄, StatusBadge 하나를 둡니다. 이 줄은 Inline wrap={false}로 한 줄을 지킵니다. 긴 이름은 Card.Title lines={1}로 말줄임이 되고 배지는 제자리에 남아, 모든 카드가 머리줄 높이를 지킵니다.',
      ],
      [
        '상태',
        'StatusBadge 하나가 상태를 글로 말합니다. Avatar.Status의 live는 지금 작업 중인 항목에만 켭니다. 색 띠, 테두리, 색을 입힌 카드는 쓰지 마세요. 상태는 카드 위의 점으로 나타내고, 카드의 면으로 나타내지 않습니다.',
      ],
      [
        '본문',
        '마지막 메시지처럼 항목마다 다른 글은 Text lines={2}로 두어 모든 본문의 높이를 같게 합니다. 전체 글은 카드를 여는 곳에서 보입니다.',
      ],
      [
        '푸터',
        '높이가 정해진 부분만 둡니다. Meter는 한 줄을 다 쓰고, 그 아래 Stat.Group에 작은 Stat을 한 줄로 넣습니다. 카드 최소 너비에는 4개쯤 들어갑니다. 푸터가 카드 맨 아래에 놓여 같은 줄 카드의 푸터가 나란히 맞습니다.',
      ],
      [
        '빈 값',
        '부분을 빼지 말고 0이나 대시를 보이세요. 그래야 뒤의 부분이 제자리를 지킵니다.',
      ],
      [
        '상세',
        'Card.Action은 Sheet를 열어 컬렉션이 화면에 남게 합니다. Dialog는 이름 바꾸기 같은 작업용입니다. 세션의 모든 턴처럼 긴 기록은 페이지를 따로 두세요.',
      ],
    ],
    exampleLabel: '에이전트 세션',
    context: '컨텍스트',
    contextText: (value: number) => `컨텍스트 창의 ${value}%를 썼습니다`,
    countsLabel: '세션 집계',
    turns: '턴',
    tools: '도구',
    tokens: '토큰',
    elapsed: '시간',
    closeSheet: (name: string) => `${name} 닫기`,
    recentTurns: '최근 턴',
    details: '상세',
    directory: '디렉터리',
    started: '시작 시각',
    agent: '에이전트',
    noValue: '—',
    sessions: [
      {
        name: 'platform-api',
        agent: 'devbox의 Claude Code',
        state: '작업 중',
        tone: 'progress',
        live: true,
        message:
          '카드 푸터를 바꾼 뒤 Playwright 테스트를 돌리는 중입니다. 640개 중 212개를 마쳤고, 아직 실패는 없습니다.',
        context: 62,
        turns: 48,
        tools: 131,
        tokens: '1.2M',
        elapsed: '2h 14m',
        directory: '~/src/platform-api',
        started: '오늘 09:12',
        turnsLog: [
          {
            title: '브라우저 테스트 실행',
            time: '11:26',
            dateTime: '2026-11-08T11:26:00',
            status: '실행 중',
            tone: 'progress',
            tools: 'Bash ×2',
          },
          {
            title: '푸터를 아래로 이동',
            time: '11:18',
            dateTime: '2026-11-08T11:18:00',
            status: '완료',
            tone: 'success',
            reply:
              '카드를 세로로 쌓고 푸터가 아래에 남은 공간을 차지하게 했습니다. 이제 같은 줄 카드의 푸터가 나란히 맞습니다.',
            tools: 'Read ×3 · Edit ×2 · Bash',
          },
          {
            title: '푸터가 어긋나는 이유 조사',
            time: '11:02',
            dateTime: '2026-11-08T11:02:00',
            status: '완료',
            tone: 'success',
            tools: 'Grep ×4 · Read ×6',
          },
        ],
      },
      {
        name: 'billing-worker',
        agent: 'nas의 Claude Code',
        state: '입력 필요',
        tone: 'caution',
        message:
          '새 큐 설정을 적용하도록 worker 컨테이너를 재시작해도 되는지 묻습니다.',
        context: 38,
        turns: 12,
        tools: 40,
        tokens: '310K',
        elapsed: '41m',
        directory: '~/src/billing-worker',
        started: '오늘 10:45',
        turnsLog: [
          {
            title: 'worker 컨테이너 재시작',
            time: '11:24',
            dateTime: '2026-11-08T11:24:00',
            status: '승인 대기',
            tone: 'caution',
            tools: 'Bash',
          },
        ],
      },
      {
        name: 'docs-site',
        agent: 'gpu-1의 opencode',
        state: '유휴',
        tone: 'neutral',
        message: '패널 3개를 LineChart로 옮기고 테스트를 업데이트했습니다.',
        context: 88,
        turns: 95,
        tools: 284,
        tokens: '2.6M',
        elapsed: '5h 02m',
        directory: '~/src/docs-site',
        started: '오늘 06:20',
        turnsLog: [
          {
            title: '패널 테스트 업데이트',
            time: '11:10',
            dateTime: '2026-11-08T11:10:00',
            status: '완료',
            tone: 'success',
            tools: 'Edit ×5 · Bash ×2',
          },
        ],
      },
      {
        name: 'search-indexer',
        agent: 'devbox의 Claude Code',
        state: '실패',
        tone: 'danger',
        message:
          '인덱스 토큰이 만료되어 두 번째 샤드를 가져오다 실행이 멈췄습니다.',
        context: 14,
        turns: 6,
        tools: 9,
        tokens: '',
        elapsed: '8m',
        directory: '~/src/search-indexer',
        started: '오늘 11:15',
        turnsLog: [
          {
            title: '두 번째 샤드 가져오기',
            time: '11:23',
            dateTime: '2026-11-08T11:23:00',
            status: '실패',
            tone: 'danger',
            reply: '인덱스가 401로 응답했습니다. 토큰이 만료되었습니다.',
            tools: 'Bash',
          },
        ],
      },
    ],
  },
}
