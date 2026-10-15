// Each policy has its own argument, counterargument and reply. Never substitute
// a shared topic template: borrowing money and lending it are different choices.
export const POLICY_DIALOGUE:Record<string,[string,string,string]>={
 hospitals:[
  '응급실 대기표가 놀이공원 인기 놀이기구보다 길더군요. 병상과 의료 인력을 함께 늘려서, 아픈 사람이 기다리는 실력부터 늘리는 일은 끝냈으면 합니다.',
  '침대는 주문하면 오지만 간호사는 택배로 오지 않잖아요. 병상 숫자만 채우고 기존 의료진의 근무표를 고무줄처럼 늘릴까 걱정입니다.',
  '그래서 채용과 휴식 보장도 병상 확충에 묶자는 거죠. 준공식 리본 자를 손은 많으니, 환자 돌볼 손부터 충분히 확보합시다.'
 ],
 quarantine:[
  '바이러스는 회식 끝나는 시간을 기다려 주지 않더군요. 잠깐 모임을 줄여 병원에 숨 돌릴 틈을 주자는 쪽에 한 표 보탭니다.',
  '모임은 취소할 수 있어도 가게 월세까지 취소 버튼이 있는 건 아니죠. 문 닫으라는 안내문 옆에 생계 지원 방법도 붙여 주셨으면 해요.',
  '영업 제한과 보상 기준을 같이 정하면 어떨까요. 방역 수칙만 매일 새로고침되고 지원 날짜는 로딩 중인 상황부터 막아야죠.'
 ],
 healthAid:[
  '방역 물자를 같이 사면 가격 협상도 수월하겠네요. 바이러스가 국경에서 여권을 꺼내는 것도 아닌데, 약 상자끼리는 좀 왕래하게 합시다.',
  '공동 구매라더니 우리 병원 배송만 맨 마지막이면 곤란해요. 국제 우정도 좋지만 오늘 쓸 마스크 재고부터 확인하고 계약했으면 합니다.',
  '나눌 기준과 긴급 배송 순서를 미리 정해 두면 되죠. 단체 주문은 했는데 누가 받을지 몰라 약 상자가 외교 회의에 참석하면 안 되니까요.'
 ],
 evacuate:[
  '대피 버스는 비가 그친 뒤 오면 관광버스가 되는 거죠. 위험할 때 먼저 이동시키고, 거동이 불편한 이웃부터 함께 챙겼으면 합니다.',
  '대피소 위치만 알려 주면 고양이와 휠체어는 어디로 가나요. 지도에 찍힌 점 하나가 모두에게 갈 수 있는 장소인 건 아니잖아요.',
  '이동 지원과 반려동물 공간까지 준비해서 데리러 갑시다. 대피 안내가 길 찾기 시험이 되면 제일 도움이 필요한 사람이 남게 돼요.'
 ],
 rebuild:[
  '끊어진 길이 열려야 구호품도 들어오겠죠. 복구 현수막은 벌써 도착했으니 이번에는 굴착기도 같은 배송 서비스를 이용해 주시면 좋겠습니다.',
  '급하다고 공사 계약까지 눈 감고 하면 또 보수할 일이 생겨요. 이번 복구가 다음 복구 사업의 예고편이 되지는 않았으면 합니다.',
  '먼저 고칠 곳과 공사 내역을 주민에게 공개합시다. 현장 사진만 올리지 말고 오늘 어느 길까지 통하는지 알려 주면 훨씬 쓸모 있겠네요.'
 ],
 ration:[
  '생수가 빨리 달린 사람의 전리품이 되는 건 곤란하죠. 필수 물자를 나눠 받게 하면 지갑 두께로 생존 순서를 정하는 일은 줄겠네요.',
  '배급 줄에 하루 종일 서면 일당은 누가 벌어 주나요. 물 한 통 받으러 갔다가 오늘 저녁 반찬값을 놓고 올까 걱정입니다.',
  '시간대 예약과 거동 불편 가구 배송도 같이 합시다. 공평하게 나눈다면서 모든 시민에게 똑같이 긴 줄을 선물할 필요는 없잖아요.'
 ],
 relief:[
  '냉장고는 경기 회복 전망을 넣어도 채워지지 않더라고요. 당장 식비가 모자란 집에 생활비가 닿으면 오늘 저녁부터 달라질 수 있습니다.',
  '지원 기준 바로 위라는 이유로 못 받는 집도 빠듯해요. 형편은 계단이 아닌데 서류에서는 한 칸 차이로 갑자기 부자가 되더군요.',
  '문턱 근처 가구는 지원을 천천히 줄이는 방식도 있죠. 도움이 필요한지 확인하되 가난을 증명하는 오디션까지 열지는 맙시다.'
 ],
 credit:[
  '이자가 낮아지면 밀린 재료비부터 낼 수 있겠네요. 가게 셔터가 영구 휴가를 떠나기 전에 잠깐 버틸 자금을 빌릴 길은 필요합니다.',
  '손님은 안 늘었는데 갚을 날짜만 늘어나면 어떡하죠. 대출을 매출로 착각하면 장부는 잠깐 웃어도 다음 달 사장 얼굴은 울상일 텐데요.',
  '대출과 함께 상환 유예나 판로 지원도 살펴봅시다. 숨통을 틔워 준다면서 은행 알림 문자만 더 자주 숨 쉬게 만들면 곤란하죠.'
 ],
 work:[
  '이력서 파일 이름에 최종이 세 번 붙었습니다. 동네에 필요한 공공 일부터 하며 경력을 쌓고 다음 직장으로 갈 발판이 생기면 좋겠네요.',
  '사업 끝나는 날 다시 실업자면 명찰만 기념품으로 남겠죠. 채용 인원 발표만큼 계약 종료 뒤에 어디로 갈지도 궁금합니다.',
  '실무 교육과 민간 채용 연결을 함께 붙이면 어떨까요. 일자리 사업이 회전문이 되지 않게, 들어가는 문 다음에 나갈 길도 만듭시다.'
 ],
 housing:[
  '비 피할 방이 있어야 다음 날 면접 준비도 하죠. 긴급 주거가 생기면 집 주소 대신 사정을 길게 설명하는 일부터 줄어들겠습니다.',
  '집은 싸도 출근길이 대장정이면 교통비가 월세를 대신하겠네요. 빈 땅에 건물만 올리지 말고 병원과 버스도 같이 봐 주세요.',
  '기존 빈집을 활용하고 생활 시설 가까운 곳부터 찾읍시다. 입주 열쇠 하나 받았다고 하루가 갑자기 두 시간 길어지는 건 아니니까요.'
 ],
 repair:[
  '다리 점검을 사고 속보 보고 시작하지는 맙시다. 매일 건너는 길에 먼저 돈을 쓰면 출근할 때마다 운을 시험할 필요는 없겠죠.',
  '멀쩡한 구간까지 한꺼번에 막으면 동네가 거대한 우회전 코스가 돼요. 안전 공사라 해도 상점 출입구까지 봉인하지는 말아 주세요.',
  '위험한 곳부터 나눠 공사하고 우회로를 먼저 알립시다. 공사 안내판보다 내비게이션의 한숨이 먼저 나오는 일은 줄일 수 있겠네요.'
 ],
 grid:[
  '정전 때마다 냉장고 음식으로 급히 잔치를 열고 있어요. 전력망을 보강하고 공급원을 나누면 병원과 가게도 덜 불안하겠죠.',
  '새 설비는 환영하지만 전기요금이 먼저 미래로 뛰어갈까 걱정입니다. 투자비를 누가 얼마나 부담하는지 설명부터 듣고 싶어요.',
  '취약 가구 부담을 살피고 고장이 잦은 곳부터 연결합시다. 전력 전환의 첫 성과가 멋진 조감도보다 덜 꺼지는 전등이면 좋겠네요.'
 ],
 defend:[
  '병사 장비가 박물관 전시품과 동창이면 교체할 때죠. 방어 장비를 손봐서 현장에서는 용기만으로 고장을 해결하지 않아도 됐으면 해요.',
  '비싼 장비를 샀는데 정비할 예산이 없으면 거대한 장식품이잖아요. 구매 발표 옆에 부품 조달과 유지 계획도 같이 보여 주세요.',
  '유지비까지 따져 필요한 장비부터 바꾸면 되죠. 이웃에게도 방어 목적을 설명해서 장비 박스와 함께 오해까지 수입하지는 맙시다.'
 ],
 patrol:[
  '비상구 위치를 실제 상황에서 처음 찾고 싶지는 않아요. 경계와 대피 훈련을 미리 하면 당황할 때도 발이 갈 방향은 알겠죠.',
  '예고 없이 사이렌이 울리면 훈련보다 심장 운동부터 합니다. 가게와 학교가 준비할 수 있게 일정과 범위를 먼저 알려 주세요.',
  '대피 방법은 익히되 일상을 계속 멈추지는 맙시다. 훈련의 성적표는 사이렌 소리 크기보다 시민이 길을 제대로 아는지로 봐야죠.'
 ],
 mediation:[
  '말로 풀 수 있는 갈등이면 회의실 의자를 더 놓읍시다. 국경에서 맞서는 것보다 식탁에서 표정 관리하는 편이 시민에게는 낫겠죠.',
  '정상들이 웃으며 악수한 사진은 이미 앨범 한 권이에요. 이번에는 어떤 약속을 언제 지킬지 사진 설명에도 좀 적어 주셨으면 합니다.',
  '작은 합의라도 이행 날짜와 확인 절차를 붙입시다. 회담이 끝났다는 소식보다 위험이 줄었다는 소식을 다음 기사에서 보고 싶네요.'
 ],
 openTrade:[
  '항구에 묶인 수출 상자가 직원보다 출근을 오래 하네요. 교역 장벽을 낮추면 물건이 움직이고 주문도 다시 이어질 수 있겠죠.',
  '문을 활짝 열면 준비가 덜 된 작은 업체는 바람부터 맞아요. 값싼 수입품과 경쟁할 시간을 주지 않으면 개방 축하에 참석하기 어렵겠네요.',
  '장벽은 단계적으로 낮추고 작은 업체의 판로도 챙깁시다. 무역의 문이 회전문처럼 큰 회사만 편하게 드나드는 구조는 피해야죠.'
 ],
 reserve:[
  '품절 안내문은 끓여 먹을 수가 없더군요. 식량과 필수 자원을 미리 확보하면 공급이 끊겨도 당장 장바구니부터 비지는 않겠죠.',
  '창고에 쌓아 두기만 하면 유통기한이 정책보다 먼저 끝나요. 비축량 자랑도 좋지만 어떤 물건부터 꺼내 쓸지 관리가 필요합니다.',
  '오래된 물자는 먼저 순환하고 창고 상태도 점검합시다. 비상식량이 비상하게 오래된 식량이라는 뜻은 아니어야 하잖아요.'
 ],
 farm:[
  '농작물은 비 예보만 보고 갈증을 참아 주지 않죠. 관개 시설과 농업 지원이 들어오면 갈라진 밭에도 다음 수확을 기대할 여지가 생깁니다.',
  '물길이 큰 농장 앞에서만 친절하게 멈추지는 않겠죠. 작은 농가는 지원 신청서 작성하는 동안 밭이 더 마를까 걱정입니다.',
  '농가 규모와 물 부족 정도를 함께 보고 순서를 정합시다. 현장 접수도 열어서 물보다 먼저 필요한 것이 프린터가 되는 일은 막아요.'
 ],
 automation:[
  '공장의 반복 작업을 기계가 맡으면 생산이 빨라지겠네요. 사람이 하루 종일 같은 나사와 눈싸움하기보다 다른 기술을 익힐 여유도 생기면 좋죠.',
  '자동화 설비 개통식이 직원 송별회를 겸할까 걱정입니다. 생산성이 좋아진다는 말에 우리 출입증까지 자동으로 꺼지면 곤란하잖아요.',
  '장비 지원에 직무 전환과 고용 대책을 같이 묶읍시다. 기계 사용 설명서는 두꺼운데 사람의 다음 업무는 빈칸으로 남겨 두지 말고요.'
 ],
 retrain:[
  '새 기술을 배우려 해도 퇴근하면 체력이 먼저 로그아웃해요. 교육 시간과 비용을 지원하면 직장을 바꿀 준비가 훨씬 현실적이겠죠.',
  '수료증은 늘었는데 채용 공고는 여전히 경력자만 찾더군요. 강의 출석 도장이 취업 도장으로 자동 변환되는 건 아니잖아요.',
  '기업이 필요한 업무를 교육에 넣고 실습도 연결합시다. 강좌 이름에 미래를 붙이는 것보다 수료 후 일할 곳 하나가 더 든든하겠네요.'
 ],
 cyber:[
  '공공 사이트가 멈추니 민원도 같이 강제 휴가더군요. 보안과 백업에 투자해서 파일 하나가 나라 전체 업무와 동반 실종되지는 않게 합시다.',
  '보안을 강화한다면서 비밀번호만 자주 바꾸라고 하겠죠. 시민 정보는 더 모으고 관리 책임은 더 흐려지는 방향은 걱정스럽습니다.',
  '접근 권한을 줄이고 복구 훈련까지 해야 효과가 있겠네요. 백업 파일 이름이 진짜최종이라고 해서 진짜 복구가 되는 건 아니니까요.'
 ],
 pension:[
  '가족 돌봄 일정표가 야간 근무표보다 빽빽합니다. 돌봄 인력과 노후 안전망이 늘면 가족끼리 교대 근무하듯 버티는 일도 줄겠죠.',
  '돌봄 담당자에게 좋은 마음만 무한 충전하라고 하면 오래 못 가요. 이용자 지원뿐 아니라 일하는 사람의 임금과 휴식도 살펴야 합니다.',
  '지속할 재원과 인력 대우를 함께 정합시다. 모두가 나이 드는데 노후 계획을 미래의 가족 단체 채팅방에만 맡길 수는 없잖아요.'
 ],
 migration:[
  '동네 공장 구인 안내가 계절 장식처럼 붙어 있더군요. 새로 오는 사람들이 정착할 수 있으면 일터와 지역에도 활기가 돌겠죠.',
  '사람만 초대하고 집과 학교가 그대로면 다 같이 불편해져요. 환영 현수막은 넓은데 정작 버스 자리는 늘지 않을까 걱정입니다.',
  '기존 주민과 새 이웃이 함께 쓸 시설을 늘려야죠. 정착 지원이 주소 등록으로 끝나지 않게 언어와 노동 상담도 곁들입시다.'
 ],
 bonds:[
  '급한 공공 사업을 멈추느니 국채로 재원을 마련할 수는 있죠. 다만 국가 통장에 들어온 돈이 공짜 용돈은 아니라는 표시도 붙여 둡시다.',
  '오늘 예산 발표에는 박수 소리, 나중 상환일에는 알림 소리가 나겠네요. 정부가 빌린 돈인데 청구서 수신자는 다음 세대일까 걱정이에요.',
  '차입 목적과 갚을 계획을 국채 발행 때 함께 공개합시다. 빚으로 시간을 샀으면 그동안 문제를 풀어야지 달력만 넘기면 안 되잖아요.'
 ],
 tax:[
  '위기에도 큰 이익을 낸 곳이 조금 더 부담하면 좋겠어요. 재원 찾을 때마다 월급 명세서가 자동 검색 첫 줄에 뜨는 상황도 바꿔 보고요.',
  '초과 이익의 기준이 매번 움직이면 사업 계획은 눈치 시험이 되죠. 한시 부담금이 이름만 한시이고 계속 연장될까 걱정됩니다.',
  '걷는 기준과 종료 조건부터 분명히 써 놓읍시다. 세금 안내문의 작은 글씨를 다 읽어야만 투자 계획을 세울 수 있는 나라는 피해야죠.'
 ],
 rescue:[
  '이웃 재난에 구조대와 물자를 보내는 건 필요한 일이라고 봐요. 도움의 손길은 다음 위기에 우리에게 돌아올 가장 따뜻한 답장이 될 수 있죠.',
  '파견 소식은 반갑지만 우리 지역 구조 인력까지 비면 곤란하죠. 해외 활동 사진 뒤에 국내 당직표가 구멍 나 있지는 않은지 확인해 주세요.',
  '국내 대응 여력을 남기고 현지에서 필요한 물자부터 보내면 되죠. 보내는 쪽의 기념품 목록보다 받는 쪽의 요청 목록을 먼저 펼칩시다.'
 ],
 climateReady:[
  '옆 지역 재난을 남의 동네 날씨 이야기로 넘기면 안 되죠. 대피로와 제방을 미리 살피면 위험이 찾아와도 처음 뵙겠습니다 하지는 않겠네요.',
  '점검표에 도장만 늘면 제방은 서류상으로만 튼튼해지죠. 위험하다고 적힌 곳을 언제 고칠지까지 정하지 않으면 종이 운동일 뿐이에요.',
  '점검 결과와 보수 일정을 주민에게 함께 공개합시다. 비 오기 전에는 담당 부서를 찾고 비 온 뒤에는 책임자를 찾는 순환부터 끊어야죠.'
 ]
};

export type Stat = 'economy' | 'support' | 'military' | 'infrastructure' | 'relations';
export type Stats = Record<Stat, number>;
export const STAT_NAMES: Record<Stat,string> = {economy:'경제',support:'국민 지지율',military:'군사력',infrastructure:'인프라',relations:'국제 관계'};
export const NATIONS = [
 {name:'아우로리아 연방',short:'아우로리아',theory:'현실주의',color:'#f07878',motto:'안보가 있어야 국가도 있다',region:'북부 산악 지대',want:'군사력 65 이상',goal:'military' as Stat,stats:{economy:48,support:60,military:78,infrastructure:45,relations:35},money:110,description:'힘의 균형과 자국의 생존을 우선합니다. 군사력이 강하지만 외교적 신뢰를 쌓아야 합니다.'},
 {name:'벨바르 공화국',short:'벨바르',theory:'자유주의',color:'#78b6ff',motto:'교역과 협력으로 번영을',region:'동부 해안 무역권',want:'경제 70 이상',goal:'economy' as Stat,stats:{economy:76,support:55,military:35,infrastructure:60,relations:55},money:125,description:'제도와 무역, 상호 의존을 중시합니다. 협력에 유리하지만 군사적 압박에 취약합니다.'},
 {name:'키레네 왕국',short:'키레네',theory:'종속이론',color:'#edbd67',motto:'자원을 넘어 자립으로',region:'남부 자원·해협 지대',want:'인프라 60 이상',goal:'infrastructure' as Stat,stats:{economy:57,support:48,military:50,infrastructure:35,relations:45},money:140,description:'불평등한 경제 구조와 외부 의존을 경계합니다. 자원 수입을 산업과 기반 시설로 전환해야 합니다.'},
 {name:'도란 중립연합',short:'도란',theory:'구성주의',color:'#76d9bb',motto:'신뢰가 세계를 바꾼다',region:'서부 고원 중립권',want:'국제 관계 70 이상',goal:'relations' as Stat,stats:{economy:52,support:70,military:25,infrastructure:58,relations:80},money:105,description:'정체성, 규범, 인식의 변화를 중시합니다. 높은 신뢰를 바탕으로 평화와 협력을 이끌 수 있습니다.'}
];
export type Effect = Partial<Stats> & {money?:number};
export type Choice = {id?:string;image?:string;context?:string;opinions?:[string,string,string];label:string;detail:string;effect:Effect;tension:number};
export const CHOICES: Choice[][] = [
 [{label:'방위 체계 개편',detail:'군사 +16 · 지지 +5 · 국제 관계 −9 · 국고 −25',effect:{military:16,support:5,relations:-9,money:-25},tension:6},{label:'안보 대화 개시',detail:'국제 관계 +16 · 경제 +7 · 군사 −8',effect:{relations:16,economy:7,military:-8},tension:-5},{label:'군수품 수출',detail:'국고 +45 · 경제 +8 · 지지 −8 · 국제 관계 −12',effect:{money:24,economy:8,support:-8,relations:-12},tension:8}],
 [{label:'공동 시장 확대',detail:'경제 +16 · 국제 관계 +8 · 국고 −30',effect:{economy:16,relations:8,money:-30},tension:-3},{label:'긴급 보호 관세',detail:'국고 +40 · 경제 +6 · 국제 관계 −14 · 지지 −5',effect:{money:22,economy:6,relations:-14,support:-5},tension:5},{label:'사회 안전망 투자',detail:'지지 +18 · 인프라 +8 · 국고 −35',effect:{support:18,infrastructure:8,money:-35},tension:-2}],
 [{label:'자원 산업 국유화',detail:'국고 +45 · 지지 +12 · 국제 관계 −15 · 경제 −6',effect:{money:24,support:12,relations:-15,economy:-6},tension:5},{label:'자립 산업 육성',detail:'인프라 +20 · 경제 +10 · 국고 −40',effect:{infrastructure:20,economy:10,money:-40},tension:0},{label:'해외 자본 유치',detail:'국고 +35 · 경제 +15 · 지지 −14 · 인프라 −5',effect:{money:20,economy:15,support:-14,infrastructure:-5},tension:-2}],
 [{label:'평화 중재 회의',detail:'국제 관계 +18 · 지지 +8 · 국고 −25',effect:{relations:18,support:8,money:-25},tension:-8},{label:'국가 정체성 캠페인',detail:'지지 +18 · 국제 관계 +8 · 경제 −8',effect:{support:18,relations:8,economy:-8},tension:-2},{label:'방위 노선 전환',detail:'군사 +20 · 국고 +20 · 지지 −15 · 국제 관계 −12',effect:{military:20,money:12,support:-15,relations:-12},tension:7}]
];
export type WorldEvent={title:string;description:string;category:string;multiplier:number;effect:Effect;nation:number;local:Effect;tension:number;deaths?:number;unemployed?:number;crisis?:string};
export const EVENTS:WorldEvent[] = [
 {title:'해협의 긴장',description:'아르덴 해협에 군함이 집결했습니다. 군사 행동 비용이 25% 오릅니다. 해협을 끼고 있는 키레네의 인프라가 6 감소합니다.',category:'military',multiplier:1.25,effect:{relations:-4},nation:2,local:{infrastructure:-6},tension:8},
 {title:'세계 무역 회복',description:'해상 운송이 회복됩니다. 공개 행동 비용이 20% 내려가고 모든 국가의 경제가 7 증가합니다. 벨바르는 경제가 추가로 5 증가합니다.',category:'public',multiplier:.8,effect:{economy:7},nation:1,local:{economy:5},tension:-4},
 {title:'국제 팬데믹',description:'국경을 넘는 감염 확산. 모든 국가 경제 −9, 지지 −8, 인프라 −5. 국내 행동 비용 20% 상승. 도란은 국제 관계 +4.',category:'domestic',multiplier:1.2,effect:{economy:-9,support:-8,infrastructure:-5},nation:3,local:{relations:4},tension:9,deaths:85,unemployed:95,crisis:'health'},
 {title:'국제 평화 주간',description:'시민들이 대화를 요구합니다. 공개 행동 비용 25% 감소. 모든 국가 지지 +3, 도란 국제 관계 +8.',category:'public',multiplier:.75,effect:{support:3},nation:3,local:{relations:8},tension:-8},
 {title:'기후 변화와 자연재해',description:'거센 폭풍과 홍수가 항구를 덮칩니다. 모든 국가 인프라 −12, 경제 −5. 국내 행동 비용 25% 상승. 해안국 벨바르 인프라 추가 −5.',category:'domestic',multiplier:1.25,effect:{infrastructure:-12,economy:-5},nation:1,local:{infrastructure:-5},tension:6,deaths:60,unemployed:70,crisis:'disaster'},
 {title:'인구 구조의 변화',description:'고령화와 일손 부족이 사회를 흔듭니다. 모든 국가 경제 −6, 지지 −5. 국내 행동 비용 15% 상승. 키레네 인프라 추가 −4.',category:'domestic',multiplier:1.15,effect:{economy:-6,support:-5},nation:2,local:{infrastructure:-4},tension:2,unemployed:25},
 {title:'기술 혁명과 디지털 전환',description:'자동화와 디지털 산업이 확산됩니다. 모든 국가 인프라 +10, 경제 +7, 지지 −4. 국내 행동 비용 20% 감소. 벨바르 경제 추가 +5.',category:'domestic',multiplier:.8,effect:{infrastructure:10,economy:7,support:-4},nation:1,local:{economy:5},tension:-2,unemployed:24},
 {title:'세계 금융 위기',description:'은행의 대출 문이 닫히고 기업의 도산이 이어집니다.',category:'domestic',multiplier:1.3,effect:{economy:-15,support:-7},nation:1,local:{economy:-4},tension:8,unemployed:130,crisis:'finance'},
 {title:'식량 공급 붕괴',description:'흉작과 수출 제한으로 식탁이 위태로워집니다.',category:'domestic',multiplier:1.25,effect:{economy:-7,support:-12},nation:2,local:{support:-3},tension:9,deaths:22,unemployed:35,crisis:'food'},
 {title:'대규모 정전',description:'도시의 불이 꺼지고 공장의 생산이 멈췄습니다.',category:'domestic',multiplier:1.2,effect:{infrastructure:-14,economy:-8},nation:0,local:{infrastructure:-3},tension:6,deaths:14,unemployed:80,crisis:'disaster'},
 {title:'국제 사이버 공격',description:'금융망과 공공 서비스가 동시에 흔들립니다.',category:'secret',multiplier:1.4,effect:{economy:-9,relations:-8,infrastructure:-6},nation:1,local:{economy:-3},tension:12,unemployed:65,crisis:'cyber'},
 {title:'대지진과 물류 마비',description:'건물과 도로가 무너지고 구조대가 현장으로 향합니다.',category:'domestic',multiplier:1.3,effect:{infrastructure:-18,support:-9,economy:-6},nation:3,local:{infrastructure:-3},tension:8,deaths:110,unemployed:100,crisis:'disaster'},
 {title:'난민 이동과 주거 위기',description:'삶의 터전을 잃은 이들이 몰리며 주거와 구호 체계에 부담이 커집니다.',category:'public',multiplier:1.2,effect:{support:-9,infrastructure:-7},nation:2,local:{economy:-3},tension:7,deaths:16,unemployed:55,crisis:'disaster'}
];
export type Category = 'public'|'secret'|'military'|'domestic';
export type ActionDef = {id:string;name:string;category:Category;cost:number;seconds:number;target?:boolean;description:string};
export const ACTIONS: ActionDef[] = [
 {id:'statement',name:'평화 공식 성명',category:'public',cost:8,seconds:12,description:'국제 관계 +7 · 지지 +3 · 긴장 −3'},
 {id:'treaty',name:'협정 제안',category:'public',cost:20,seconds:20,target:true,description:'상대 수락 시 양국 경제 +10 · 관계 +8 · 긴장 −5'},
 {id:'aid',name:'경제 원조',category:'public',cost:35,seconds:28,target:true,description:'상대 국고 +25 · 경제 +7 / 나의 관계 +10 · 지지 −3'},
 {id:'sanction',name:'경제 제재',category:'public',cost:25,seconds:32,target:true,description:'상대 경제 −13 · 국고 −15 / 나의 경제 −4 · 관계 −5 · 긴장 +8'},
 {id:'message',name:'비밀 전문',category:'secret',cost:0,seconds:5,target:true,description:'두 국가에만 전달 · 턴당 6회 · 240자 이내'},
 {id:'backchannel',name:'비공개 협력 제안',category:'secret',cost:18,seconds:24,target:true,description:'상대 수락 시 양국 국고 +15 · 관계 +6. 제안·결과는 두 국가만 열람'},
 {id:'mobilize',name:'국경 병력 증강',category:'military',cost:28,seconds:35,description:'군사 +13 · 지지 +3 · 관계 −6 · 긴장 +7'},
 {id:'ultimatum',name:'최후통첩',category:'military',cost:18,seconds:24,target:true,description:'상대가 양보하면 국고 20 이전. 거부·기한 만료 시 상대 지지 +4 · 긴장 +6'},
 {id:'war',name:'전쟁 선포',category:'military',cost:55,seconds:55,target:true,description:'군사력 비교로 승패 결정. 양국 군사·경제·기반 시설 손실, 선전국 관계 −22 · 긴장 +22'},
 {id:'economy',name:'산업 투자',category:'domestic',cost:30,seconds:35,description:'경제 +13 · 인프라 +3'},
 {id:'support',name:'민생 지원',category:'domestic',cost:25,seconds:26,description:'국민 지지율 +15'},
 {id:'infrastructure',name:'기반 시설 건설',category:'domestic',cost:32,seconds:42,description:'인프라 +16 · 경제 +4'}
];
export type Player = {objectiveDone?:boolean;pledge?:PublicPledge;memory?:{policy:string;round:number};policies?:Choice[];selectedPolicy?:Choice;isAI?:boolean;id:string;name:string;nation:number;ready:boolean;lastSeen:number;stats:Stats;money:number;choice:number|null;used:Record<string,number>;history:Record<string,number>;prepared?:Record<string,number>;deaths?:number;unemployed?:number;eventLosses?:Record<string,{deaths:number;unemployed:number}>};
export function canStart(players: Pick<Player, 'nation'|'ready'>[], aiCount=0) {
 return Number.isInteger(aiCount) && aiCount>=0 && players.length>=1 && players.length+aiCount>=2 && players.length+aiCount<=4 && players.every(p=>p.ready&&Number.isInteger(p.nation)&&p.nation>=0&&p.nation<NATIONS.length) && new Set(players.map(p=>p.nation)).size===players.length;
}
export type Job = {policy?:Choice;id:string;actor:number;target:number;action:string;start:number;end:number;text:string;choice?:number;topic?:string};
export type Offer = {id:string;from:number;to:number;kind:string;expires:number;status:'pending'|'accepted'|'rejected'|'expired';topic?:string};
export type Log = {id:string;round:number;text:string;actor:number;kind:string;privateTo?:number[]};
export type Article = {headline:string;body:string;image:number;tag:string};
export type Edition = {nation:number;articles:Article[];figures?:{deaths:number;unemployed:number;worldDeaths:number;worldUnemployed:number;eventTitle:string;eventDeaths:number;worldEventDeaths:number}};
export type News = {id?:string;round:number;title:string;body:string;impacts:{nation:number;delta:number;reason:string}[];editions?:Edition[];breaking?:boolean;at?:number};
export type PairRelation = {a:number;b:number;value:number;label:string;reason:string};
export type Reaction = {id:string;nation:number;text:string;at:number;urgent:boolean;privateTo?:number[];speaker?:string;batch?:string};
export type Room = {strategyVersion?:number;arc?:PandemicArc;intel?:PrivateIntel[];deals?:Deal[];voiceCounter?:number;incidents?:Incident[];dispatches?:Dispatch[];climate?:ClimateIncident;aiCount?:number;nextAI?:number;code:string;host:string;status:'lobby'|'playing'|'finished';players:Player[];round:number;duration:number;deadline:number;clock:number;event:number;tension:number;jobs:Job[];offers:Offer[];logs:Log[];news:News[];seed:number;processed:string[];created:number;relations?:PairRelation[];reactions?:Reaction[];bulletins?:News[];nextEvent?:number;pandemicAt?:number;pressCooldown?:Record<string,number>;boycotts?:{from:number;target:number;until:number}[]};
export class GameError extends Error {}
const clamp=(n:number,min=0,max=100)=>Math.max(min,Math.min(max,n));
function assert(ok:unknown,text:string):asserts ok {if(!ok)throw new GameError(text);}
export function effect(p:Player,e:Effect){for(const key of Object.keys(STAT_NAMES) as Stat[])if(e[key])p.stats[key]=clamp(p.stats[key]+e[key]!);p.money=clamp(p.money+(e.money||0),0,9999);}
function random(r:Room){r.seed=(Math.imul(1664525,r.seed)+1013904223)>>>0;return r.seed/4294967296;}
const byNation=(r:Room,n:number)=>r.players.find(p=>p.nation===n)!;
function log(r:Room,text:string,actor=-1,kind='world',privateTo?:number[]){if(kind!=='message')text=qualitativeText(text);r.logs.push({id:crypto.randomUUID(),round:r.round,text,actor,kind,...(privateTo?{privateTo}: {})});}
const short=(n:number)=>NATIONS[n]?.short||'국가';
export function createRoom(code:string,id:string,name:string,now:number,duration=90):Room{return {code,host:id,status:'lobby',players:[newPlayer(id,name,now)],round:0,duration,deadline:0,clock:now,event:0,tension:30,jobs:[],offers:[],logs:[],news:[],seed:crypto.getRandomValues(new Uint32Array(1))[0],processed:[],created:now};}
function newPlayer(id:string,name:string,now:number):Player{return {id,name,nation:-1,ready:false,lastSeen:now,stats:{economy:0,support:0,military:0,infrastructure:0,relations:0},money:0,choice:null,used:{},history:{}};}
export function income(p:Player,r?:Room){const base=.055+p.stats.economy/1200+p.stats.infrastructure/2400+(p.nation===2?.015:0);return base*1.15*(r?.boycotts?.some(b=>b.target===p.nation&&b.until>r.clock)?.5:1);}
export function price(r:Pick<Room,'event'|'climate'>,a:ActionDef,nation?:number){const e=EVENTS[r.event];const local=r.event!==4||!r.climate||nation===undefined||nation===r.climate.nation;return Math.ceil(a.cost*(local&&e.category===a.category?e.multiplier:1));}
function beginRound(r:Room){
 if(r.strategyVersion)advanceCrisis(r);
 r.event=r.nextEvent??Math.floor(random(r)*EVENTS.length);r.nextEvent=Math.floor(random(r)*EVENTS.length);
 const before=snapshot(r),impactBefore=incidentSnapshot(r),e=EVENTS[r.event];r.tension=clamp(r.tension+e.tension);
 r.climate=undefined;
 for(const p of r.players){p.choice=null;p.selectedPolicy=undefined;p.used={};if(r.event!==4){effect(p,e.effect);if(p.nation===e.nation)effect(p,e.local);}}
 if(r.event===4){const target=r.players[Math.floor(random(r)*r.players.length)];const kinds=CLIMATE_TYPES.map((c,i)=>({c,i})).filter(x=>x.c.nations.includes(target.nation));const kind=kinds[Math.floor(random(r)*kinds.length)].i;r.climate={kind,nation:target.nation,round:r.round,at:r.clock};const crisis=CLIMATE_TYPES[kind];effect(target,crisis.effect);applyDisaster(r,{...e,title:crisis.name,deaths:crisis.deaths,unemployed:crisis.unemployed},[target]);}
 else applyDisaster(r,e);
 if(r.strategyVersion){if(r.event===2&&!r.arc)r.arc={phase:1,status:"active",startedRound:r.round,phaseRound:r.round,responses:[]};if(r.round===2&&!r.arc)r.nextEvent=2;createIntel(r);}
 for(const p of r.players)p.policies=generatePolicies(r,p);
 log(r,`${currentEventTitle(r)}: ${currentEventDescription(r)}`);
 if(r.event===2)r.pandemicAt=r.clock;
 recordChanges(r,before,currentEventTitle(r));
 publishExtra(r,currentEventTitle(r),[currentEventArticle(r),forecastArticle(r)]);
 if(e.crisis||e.deaths||e.tension>=8)recordIncident(r,'crisis',currentEventTitle(r),r.climate?[r.climate.nation]:r.players.map(p=>p.nation),impactBefore);
}
function makeNews(r:Room){const before=snapshot(r);const recent=r.logs.filter(l=>l.round>r.round-2&&!l.privateTo);const wars=recent.filter(l=>l.kind==='war').length;const sanctions=recent.filter(l=>l.kind==='sanction').length;const cooperation=recent.filter(l=>['aid','treaty','statement'].includes(l.kind)).length;const title=wars?'전쟁의 대가, 흔들리는 세계 질서':sanctions>cooperation?'제재의 연쇄, 좁아지는 협상의 문':cooperation?'협력이 만든 변화, 긴장 완화의 실마리':'각국의 내정 선택, 다음 균형을 결정하다';const impacts=r.players.map(p=>{const own=recent.filter(l=>l.actor===p.nation);const aggressive=own.filter(l=>['war','sanction','mobilize'].includes(l.kind)).length;const peaceful=own.filter(l=>['aid','statement','treaty','infrastructure','support','economy'].includes(l.kind)).length;const goal=p.stats[NATIONS[p.nation].goal]>=(p.nation===0?65:p.nation===2?60:70);const delta=clamp(peaceful*2-aggressive*3+(goal?4:-4),-14,12);effect(p,{support:delta});return {nation:p.nation,delta,reason:`협력·내정 ${peaceful}건, 강경 행동 ${aggressive}건 · 국민 요구 ${goal?'충족':'미충족'}`};});const stories:Article[]=[];
 const pairs=(r.relations||[]).filter(p=>p.value!==0).sort((a,b)=>Math.abs(b.value)-Math.abs(a.value));
 if(pairs[0])stories.push(relationArticle(pairs[0]));
 stories.push(currentEventArticle(r),forecastArticle(r));
 r.news.push({id:crypto.randomUUID(),round:r.round,title,body:'',impacts,editions:editions(r,stories.slice(0,3)),at:r.clock});
 log(r,`${r.round}턴 국제 뉴스가 발행되었습니다. 국민 지지율에 여론 평가가 반영됩니다.`);recordChanges(r,before,'국제 여론 평가');
}

function resolveJob(r:Room,j:Job){const before=snapshot(r),impactBefore=incidentSnapshot(r);let battle:{winner:number;loser:number}|undefined;const p=byNation(r,j.actor),t=byNation(r,j.target),a=ACTIONS.find(a=>a.id===j.action)!;const n=short(p.nation),target=short(j.target);
 if(j.action==='crisis-response'){resolveCrisisResponse(r,j);return;}
 if(j.action==='policy'){const c=j.policy||CHOICES[p.nation][j.choice!];effect(p,{...c.effect,money:Math.max(0,c.effect.money||0)});r.tension=clamp(r.tension+c.tension);log(r,`${n}의 ${c.label} 정책 시행. ${describeEffect(c.effect)}`,p.nation,'choice');recordChanges(r,before,c.label);rememberPolicy(r,p,c);checkObjective(r,p);return;}
 p.history[j.action]=(p.history[j.action]||0)+1;switch(j.action){
 case 'statement':effect(p,{relations:7,support:3});r.tension-=3;log(r,`${n}이 평화 성명을 발표했습니다. 국제 관계 +7, 지지 +3.`,p.nation,j.action);break;
 case 'aid':effect(t,{money:25,economy:7});effect(p,{relations:10,support:-3});r.tension-=3;log(r,`${n}이 ${target}에 원조했습니다. 수원국 국고 +25, 경제 +7.`,p.nation,j.action);break;
 case 'sanction':effect(t,{economy:-13,money:-15});effect(p,{economy:-4,relations:-5});r.tension+=8;log(r,`${n}의 ${target} 제재가 발효됐습니다. 상대 경제 −13, 국고 −15; 자국 경제 −4.`,p.nation,j.action);break;
 case 'mobilize':effect(p,{military:13,support:3,relations:-6});r.tension+=7;log(r,`${n}이 국경 병력을 증강했습니다. 군사 +13, 국제 관계 −6.`,p.nation,j.action);break;
 case 'economy':effect(p,{economy:13,infrastructure:3});log(r,`${n}의 산업 투자가 완료됐습니다. 경제 +13, 인프라 +3.`,p.nation,j.action);break;
 case 'support':effect(p,{support:15});log(r,`${n}의 민생 지원으로 국민 지지가 15 상승했습니다.`,p.nation,j.action);break;
 case 'infrastructure':effect(p,{infrastructure:16,economy:4});log(r,`${n}이 기반 시설을 확충했습니다. 인프라 +16, 경제 +4.`,p.nation,j.action);break;
 case 'message':dispatch(r,p.nation,t.nation,'message','비밀 전문 도착',j.text);log(r,`${n} → ${target}: ${j.text}`,p.nation,'message',[p.nation,t.nation]);break;
 case 'treaty':case 'backchannel':case 'ultimatum':{dispatch(r,p.nation,t.nation,j.action,`${a.name} 도착`,j.action==='ultimatum'?'양보 또는 거부를 결정해 주세요.':`${COOPERATION.find(x=>x.id===(j.topic||'trade'))!.name} 제안이 도착했습니다.`);r.offers.push({id:j.id,from:p.nation,to:t.nation,kind:j.action,topic:j.topic,expires:r.deadline+r.duration*1000,status:'pending'});if(j.action==='ultimatum'){r.tension+=5;effect(p,{relations:-4});}log(r,`${n}이 ${target}에 ${a.name}을 전달했습니다. 다음 턴 종료까지 응답할 수 있습니다.`,p.nation,'offer',j.action==='backchannel'?[p.nation,t.nation]:undefined);break;}
 case 'war':{const power=p.stats.military+p.stats.infrastructure*.15,defense=t.stats.military+t.stats.infrastructure*.2;const win=power>defense;battle={winner:win?p.nation:t.nation,loser:win?t.nation:p.nation};effect(p,{military:win?-18:-28,economy:-12,infrastructure:-8,support:win?6:-15,relations:-22});effect(t,{military:win?-28:-16,economy:-10,infrastructure:-15,support:win?-12:8});if(win){const transfer=Math.min(25,t.money);t.money-=transfer;p.money+=transfer;}r.tension+=22;log(r,`${n}이 ${target}에 전쟁을 선포해 ${win?'공세에 성공':'공세에 실패'}했습니다. 양국에 군사·경제·기반 시설 피해가 발생했습니다. ${n} 군사 ${win?'−18':'−28'}, ${target} 군사 ${win?'−28':'−16'}.`,p.nation,j.action);break;}
 }r.tension=clamp(r.tension);checkObjective(r,p);
 if(['war','sanction','ultimatum'].includes(j.action))publicBacklash(r,j.actor,j.target,j.action);
 if(j.action==='war'){addLosses(p,'전쟁',Math.round((35+(100-p.stats.infrastructure)*.4)*NATIONAL_POPULATIONS[p.nation]/100000),employmentScale(p,55));addLosses(t,'전쟁',Math.round((50+(100-t.stats.infrastructure)*.6)*NATIONAL_POPULATIONS[t.nation]/100000),employmentScale(t,80));publishExtra(r,'전쟁 인명 피해',[{tag:'현장 집계',headline:'전장의 대가는 시민의 몫',body:'집으로 돌아오지 못한 이들이 늘어난다. 숫자 뒤에 남은 가족의 삶을 누가 책임질까.',image:5}]);}
 if(j.action==='economy')p.unemployed=Math.max(0,(p.unemployed||0)-employmentScale(p,24));
 if(j.action==='support')p.unemployed=Math.max(0,(p.unemployed||0)-employmentScale(p,12));
 if(j.action==='aid')solidarity(r,j.actor,j.target);
 if(j.action==='aid')changeRelation(r,j.actor,j.target,20,'경제 원조');
 if(j.action==='sanction')changeRelation(r,j.actor,j.target,-30,'경제 제재');
 if(j.action==='ultimatum')changeRelation(r,j.actor,j.target,-20,'최후통첩');
 if(j.action==='war')changeRelation(r,j.actor,j.target,-100,'무력 충돌');
 if(!['message','backchannel','treaty'].includes(j.action))recordChanges(r,before,a.name);
 if(battle){recordIncident(r,'battle',`${short(battle.winner)} 승리 · ${short(battle.loser)} 패배`,[p.nation,t.nation],impactBefore,battle);for(const fighter of [p,t])voice(r,fighter.nation,'뉴스 속 지도는 금방 칠해지는데, 무너진 집은 색칠로 돌아오지 않네요. 승패 발표 다음에는 복구 일정도 같은 글씨 크기로 부탁합니다.',true);}
}
function resolveOffer(r:Room,o:Offer,accept:boolean,expired=false){const before=snapshot(r);const p=byNation(r,o.from),t=byNation(r,o.to);if(accept&&(o.kind==='treaty'||o.kind==='backchannel'))assert(t.money>=COOPERATION.find(x=>x.id===(o.topic||'trade'))!.contribution,'협력 분담 예산이 부족합니다.');o.status=expired?'expired':accept?'accepted':'rejected';if(accept){if(o.kind==='treaty'||o.kind==='backchannel'){
 const topic=COOPERATION.find(x=>x.id===(o.topic||'trade'))!;assert(t.money>=topic.contribution,'협력 분담 예산이 부족합니다.');t.money-=topic.contribution;
 for(const x of [p,t]){effect(x,topic.effect);x.prepared??={};if(topic.protection)x.prepared[topic.protection]=Math.min(60,(x.prepared[topic.protection]||0)+22);if(topic.id==='education')x.unemployed=Math.max(0,(x.unemployed||0)-employmentScale(x,40));}
 if(o.kind==='treaty'){r.tension=clamp(r.tension-4);p.history.treatyAccepted=(p.history.treatyAccepted||0)+1;t.history.treatyAccepted=(t.history.treatyAccepted||0)+1;
 publishExtra(r,'분야별 협력 체결',[{tag:'공동 대응',headline:`${short(o.from)}·${short(o.to)}, ${topic.name}`,body:topic.news,image:topic.image}]);}
 }else{const amount=Math.min(t.money,20);t.money-=amount;p.money+=amount;effect(t,{support:-7});effect(p,{support:5});}}else if(o.kind==='ultimatum'){effect(t,{support:4});r.tension=clamp(r.tension+6);}log(r,`${short(o.to)}: ${short(o.from)}의 ${ACTIONS.find(a=>a.id===o.kind)?.name} ${expired?'기한 만료':accept?'수락':'거절'}${accept&&(o.kind==='treaty'||o.kind==='backchannel')?' — '+COOPERATION.find(x=>x.id===(o.topic||'trade'))!.name:''}.`,o.to,accept&&o.kind==='treaty'?'treaty':'response',o.kind==='backchannel'?[o.from,o.to]:undefined);
 if(o.kind==='treaty'&&accept){changeRelation(r,o.from,o.to,40,'협정 체결');checkObjective(r,p);checkObjective(r,t);}
 if(o.kind==='ultimatum'&&!accept)changeRelation(r,o.from,o.to,-10,'통첩 거부');
 dispatch(r,o.to,o.from,'response',`${ACTIONS.find(a=>a.id===o.kind)?.name} ${expired?'기한 만료':accept?'수락':'거절'}`,o.kind==='backchannel'?'비공개 협력에 대한 응답이 도착했습니다.':'외교 수신함과 기록에서 결과를 확인하세요.');
 recordChanges(r,before,accept?'외교 제안 수락':'외교 제안 거절',o.kind==='backchannel'?[o.from,o.to]:undefined);
}
export function tick(r:Room,now:number){ensureNarrative(r);if(r.status!=='playing')return;r.clock=Math.min(r.clock,now);let safety=0;while(r.clock<now&&r.status==='playing'&&safety++<2000){const due=r.jobs.length?Math.min(...r.jobs.map(j=>j.end)):Infinity;const next=Math.min(now,r.deadline,due,r.nextAI??Infinity);const dt=Math.max(0,(next-r.clock)/1000);for(const p of r.players)p.money=clamp(p.money+income(p,r)*dt,0,9999);r.clock=next;const done=r.jobs.filter(j=>j.end<=next).sort((a,b)=>a.end-b.end||a.start-b.start||a.id.localeCompare(b.id));r.jobs=r.jobs.filter(j=>j.end>next);for(const j of done)resolveJob(r,j);settleDeals(r);if(next>=r.deadline){settlePledges(r);for(const p of r.players)if(p.choice===null){p.choice=-1;effect(p,{support:-3});log(r,`${short(p.nation)}이 정책을 자동 보류했습니다. 국민 지지가 소폭 하락합니다.`,p.nation,'choice');}for(const o of r.offers)if(o.status==='pending'&&o.expires<=next)resolveOffer(r,o,false,true);if(r.round%2===0)makeNews(r);if(r.round>=10){const remaining=[...r.jobs].sort((a,b)=>a.end-b.end);r.jobs=[];for(const j of remaining)resolveJob(r,j);for(const o of r.offers)if(o.status==='pending')resolveOffer(r,o,false,true);if(r.arc?.status==='active')advanceCrisis(r,true);r.status='finished';log(r,'10턴이 종료되었습니다. 국가별 종합 평가를 확인하세요.');}else {r.round++;r.deadline+=r.duration*1000;beginRound(r);}}if(r.status==='playing'&&r.nextAI!==undefined&&r.clock>=r.nextAI){r.nextAI=r.clock+5000;runAI(r);}}}
export type Command = {aiCount?:number;type:string;requestId?:string;name?:string;nation?:number;duration?:number;round?:number;choice?:number;action?:string;target?:number;text?:string;offerId?:string;accept?:boolean;topic?:string;dealId?:string;give?:string;ask?:string;response?:string;pledge?:string};
export function command(r:Room,id:string,c:Command,now:number){tick(r,now);applyCommand(r,id,c,now);}
function applyCommand(r:Room,id:string,c:Command,now:number){let p=r.players.find(p=>p.id===id);if(c.type==='join'){if(p){p.lastSeen=now;return;}assert(r.status==='lobby','게임이 이미 시작되었습니다.');assert(r.players.length<4,'이미 4명이 참가한 방입니다.');r.players.push(newPlayer(id,cleanName(c.name),now));r.aiCount=Math.min(r.aiCount||0,4-r.players.length);return;}assert(p,'방에 먼저 참가해 주세요.');p.lastSeen=now;if(c.requestId&&r.processed.includes(`${id}:${c.requestId}`))return;
 if(['choice','action','crisis_response','share_intel','deal_propose','pledge'].includes(c.type)&&c.round!==undefined)assert(c.round===r.round,'턴이 바뀌었습니다. 현재 정책과 사건을 확인한 뒤 다시 선택해 주세요.');
 if(c.type==='select'){assert(r.status==='lobby','대기실에서만 국가를 선택할 수 있습니다.');assert(Number.isInteger(c.nation)&&c.nation!>=0&&c.nation!<4,'국가를 선택해 주세요.');assert(!r.players.some(x=>x.id!==id&&x.nation===c.nation),'다른 플레이어가 선택한 국가입니다.');p.nation=c.nation!;p.ready=false;}
 else if(c.type==='ready'){assert(r.status==='lobby'&&p.nation>=0,'국가를 먼저 선택해 주세요.');p.ready=!p.ready;}
 else if(c.type==='ai'){assert(id===r.host&&r.status==='lobby','방장만 대기실에서 AI 수를 바꿀 수 있습니다.');assert(Number.isInteger(c.aiCount)&&c.aiCount!>=0&&c.aiCount!<=4-r.players.length,'빈자리 수 이내에서 AI 수를 선택해 주세요.');r.aiCount=c.aiCount!;}
 else if(c.type==='duration'){assert(id===r.host&&r.status==='lobby','방장만 대기실에서 시간을 바꿀 수 있습니다.');assert([60,90,120].includes(c.duration!), '60, 90, 120초 중 선택해 주세요.');r.duration=c.duration!;}
 else if(c.type==='leave'){assert(r.status==='lobby','진행 중에는 재접속으로 복귀할 수 있습니다.');r.players=r.players.filter(x=>x.id!==id);if(r.host===id)r.host=r.players[0]?.id||'';}
 else if(c.type==='start'){assert(id===r.host,'방장만 시작할 수 있습니다.');assert(r.status==='lobby'&&canStart(r.players,r.aiCount||0),'AI 포함 2~4명이 참가하고 사람은 모두 서로 다른 국가를 선택한 뒤 준비해야 합니다.');for(let i=0;i<(r.aiCount||0);i++){const nation=NATIONS.findIndex((_,n)=>!r.players.some(x=>x.nation===n));r.players.push({...newPlayer(`ai:${crypto.randomUUID()}`,`AI · ${short(nation)}`,now),nation,ready:true,isAI:true});}if(r.aiCount)r.nextAI=now+1000;r.strategyVersion=1;r.status='playing';r.round=1;r.clock=now;r.deadline=now+r.duration*1000;for(const x of r.players){x.stats={...NATIONS[x.nation].stats};x.money=NATIONS[x.nation].money;}beginRound(r);}
 else if(c.type==='choice'){
 assert(r.status==='playing','진행 중인 게임이 아닙니다.');assert(p.choice===null,'이미 이번 턴의 정책을 결정했습니다.');assert(Number.isInteger(c.choice)&&c.choice!>=-1&&c.choice!<3,'정책을 선택하거나 보류해 주세요.');
 if(c.choice===-1){p.choice=-1;log(r,`${short(p.nation)}이 이번 턴의 정책을 보류했습니다.`,p.nation,'choice');voice(r,p.nation,'정책 보류라니! 지켜보자는 사람도, 지금 움직이자는 사람도 있네요.');}
 else{const choice=policyChoices(p)[c.choice!];const cost=Math.max(0,-(choice.effect.money||0));assert(p.money>=cost,'정책 예산이 부족합니다. 보류할 수 있습니다.');p.money-=cost;p.choice=c.choice!;p.selectedPolicy=structuredClone(choice);p.history[`choice${c.choice}`]=(p.history[`choice${c.choice}`]||0)+1;
 r.jobs.push({id:crypto.randomUUID(),actor:p.nation,target:-1,action:'policy',choice:c.choice!,policy:structuredClone(choice),start:now,end:now+POLICY_SECONDS*1000,text:''});
 log(r,`${short(p.nation)}이 ${choice.label} 정책을 채택했습니다. 시행 준비가 시작됩니다.`,p.nation,'choice');policyReaction(r,p.nation,c.choice!);}
 }
 else if(c.type==='action'){assert(r.status==='playing','진행 중인 게임이 아닙니다.');assert(p.choice!==null,'이번 턴의 정책을 먼저 선택해 주세요.');const a=ACTIONS.find(a=>a.id===c.action);assert(a,'알 수 없는 행동입니다.');const other=r.players.find(x=>x.nation===c.target&&x.id!==id);assert(!a.target||other,'대상 국가를 선택해 주세요.');assert(!r.jobs.some(j=>j.actor===p!.nation&&j.action===a.id),'같은 행동이 아직 진행 중입니다. 완료 후 다시 선택할 수 있습니다.');assert(r.jobs.filter(j=>j.actor===p!.nation&&j.action!=='policy').length<4,'동시에 진행할 수 있는 행동은 4개입니다.');assert(now+a.seconds*1000<=r.deadline+(10-r.round)*r.duration*1000,'게임 종료 전에 완료할 시간이 부족합니다.');assert(p.money>=price(r,a,p.nation),'국고가 부족합니다.');const text=typeof c.text==='string'?c.text.trim():'';assert(a.id!=='message'||(text.length>0&&text.length<=240),'비밀 전문은 1~240자로 작성해 주세요.');if(['treaty','backchannel'].includes(a.id))assert(COOPERATION.some(x=>x.id===c.topic),'협력 분야를 선택해 주세요.');if(a.id==='war')assert(p.stats.military>=20,'전쟁을 시작하려면 군사력 20 이상이 필요합니다.');const actionBefore=incidentSnapshot(r);p.money-=price(r,a,p.nation);if(a.id==='war'){recordIncident(r,'war-declared',`${short(p.nation)} → ${short(other!.nation)} 전쟁 선포`,[p.nation,other!.nation],actionBefore);dispatch(r,p.nation,other!.nation,'war','전쟁 선포 통보','군사 행동이 시작됐습니다. 전투 결과는 행동 완료 시 결정됩니다.');}if(['war','sanction','ultimatum'].includes(a.id))breakPeace(r,p,other!.nation);p.used[a.id]=(p.used[a.id]||0)+1;const j={id:crypto.randomUUID(),actor:p.nation,target:c.target??-1,action:a.id,start:now,end:now+a.seconds*1000,text,topic:c.topic};if(a.seconds===0)resolveJob(r,j);else r.jobs.push(j);if(a.id!=='message')voice(r,p.nation,actionReaction(a.id,c.topic),false,a.category==='secret'?[p.nation,other!.nation]:undefined);}
 else if(['crisis_response','share_intel','deal_propose','deal_respond','deal_fulfill','deal_break','pledge'].includes(c.type)){strategyCommand(r,p,c,now);}
 else if(c.type==='respond'){assert(r.status==='playing','진행 중인 게임이 아닙니다.');assert(typeof c.accept==='boolean','응답을 선택해 주세요.');const o=r.offers.find(o=>o.id===c.offerId);assert(o&&o.to===p.nation&&o.status==='pending','응답 가능한 제안이 없습니다.');resolveOffer(r,o,c.accept);}
 else if(c.type!=='heartbeat')throw new GameError('알 수 없는 요청입니다.');
 if(c.requestId){r.processed.push(`${id}:${c.requestId}`);r.processed=r.processed.slice(-180);}
}
export function cleanName(name:unknown){assert(typeof name==='string'&&name.trim().length>0&&name.trim().length<=16,'이름은 1~16자로 입력해 주세요.');return name.trim();}
export function score(p:Player){const s=p.stats;const prosperity=Math.round((s.economy+s.infrastructure)/2),stability=Math.round(s.support),security=Math.round(s.military),diplomacy=Math.round(s.relations),goal=Math.round(s[NATIONS[p.nation].goal]);return {prosperity,stability,security,diplomacy,goal,total:Math.round((prosperity+stability+security+diplomacy)*.2+goal*.2),style:(p.history.war||0)+(p.history.mobilize||0)>(p.history.treatyAccepted||0)+(p.history.statement||0)?'힘과 안보를 우선한 운영':'협력과 내정을 중시한 운영'};}
export function view(r:Room,id:string,now:number){ensureNarrative(r);const me=r.players.find(p=>p.id===id);assert(me,'방 참가자만 확인할 수 있습니다.');return {strategyVersion:r.strategyVersion||0,arc:r.arc,intel:(r.intel||[]).filter(x=>x.nation===me.nation),deals:(r.deals||[]).filter(x=>x.from===me.nation||x.to===me.nation),code:r.code,aiCount:r.aiCount||0,status:r.status,round:r.round,duration:r.duration,deadline:r.deadline,serverNow:now,event:r.event,tension:r.tension,isHost:r.host===id,players:r.players.map(p=>({...p,id:undefined,memory:undefined,objectiveDone:p.id===id||r.status==='finished'?p.objectiveDone:undefined,prepared:p.id===id?p.prepared:undefined,isMe:p.id===id,isHost:p.id===r.host,online:!!p.isAI||now-p.lastSeen<20000,money:Math.floor(p.money),income:income(p,r),used:p.id===id?p.used:{},history:p.id===id||r.status==='finished'?p.history:{}})),jobs:r.jobs.filter(j=>j.actor===me.nation),offers:r.offers.filter(o=>o.kind!=='backchannel'||o.from===me.nation||o.to===me.nation),logs:r.logs.filter(l=>!l.privateTo||l.privateTo.includes(me.nation)).slice(-160).map(l=>l.kind==='message'?l:{...l,text:qualitativeText(l.text)}),news:r.news,bulletins:r.bulletins||[],relations:r.relations||[],reactions:(r.reactions||[]).filter(x=>!x.privateTo||x.privateTo.includes(me.nation)),incidents:(r.incidents||[]).filter(x=>x.kind!=='crisis'||x.nations.includes(me.nation)),dispatches:(r.dispatches||[]).filter(x=>x.to===me.nation),pandemicAt:r.pandemicAt,climate:r.climate,boycotts:r.boycotts||[],scores:r.status==='finished'?r.players.map(p=>({nation:p.nation,name:p.name,objectiveDone:!!p.objectiveDone,...score(p)})).sort((a,b)=>b.total-a.total):[]};}
export type RoomView=ReturnType<typeof view>;

// Narrative state is stored in the room JSON; old rooms receive safe defaults.
function ensureNarrative(r:Room){
 r.deals??=[];r.intel??=[];r.relations??=[];r.reactions??=[];r.bulletins??=[];r.pressCooldown??={};r.boycotts??=[];
 if(r.status==='playing'&&r.nextEvent===undefined)r.nextEvent=Math.floor(random(r)*EVENTS.length);
 const active=r.players.filter(p=>p.nation>=0);
 for(let i=0;i<active.length;i++)for(let j=i+1;j<active.length;j++){
  const [a,b]=[active[i].nation,active[j].nation].sort((x,y)=>x-y);
  if(!r.relations.some(p=>p.a===a&&p.b===b))r.relations.push({a,b,value:0,label:'중립',reason:'공식 관계 수립'});
 }
 r.relations=r.relations.filter(x=>active.some(p=>p.nation===x.a)&&active.some(p=>p.nation===x.b));
}
export function relationLabel(value:number){return value<=-60?'충돌':value<=-15?'긴장':value>=35?'협력':value>=15?'우호':'중립';}
function changeRelation(r:Room,a:number,b:number,delta:number,reason:string){
 ensureNarrative(r);const pair=r.relations!.find(p=>p.a===Math.min(a,b)&&p.b===Math.max(a,b));if(!pair)return;
 const previous=pair.label;pair.value=reason==='무력 충돌'?-85:clamp(pair.value+delta,-100,100);pair.label=relationLabel(pair.value);pair.reason=reason;
 if(previous!==pair.label)publishExtra(r,'외교 기류 급변',[relationArticle(pair),forecastArticle(r)]);
}
function relationArticle(p:PairRelation):Article{
 const warm=p.value>0;
 return {tag:'외교 전선',headline:`${short(p.a)}·${short(p.b)}, ${p.label==='충돌'?'끝내 포성이 터졌다':warm?'손잡은 두 나라!':'얼어붙은 악수'}`,body:p.label==='충돌'?'포성이 대화를 삼켰다. 평범한 하루를 돌려달라는 목소리가 국경을 넘는다.':warm?'서로를 향한 문이 열렸다. 이 악수, 세계의 판을 뒤집을지도!':'차가운 말이 국경을 오간다. 대화의 문마저 닫히는 것 아닌가!',image:warm?4:5};
}
const EVENT_COPY:Article[]=[
 {tag:'해협',headline:'해협에 드리운 강철 그림자',body:'군함이 바다의 침묵을 깼다. 작은 오해가 거대한 불씨가 될 판이다!',image:5},
 {tag:'무역',headline:'잠들었던 항구가 깨어났다!',body:'뱃고동이 다시 울린다. 상인들은 벌써 황금빛 내일을 꿈꾼다.',image:4},
 {tag:'보건 경보',headline:'국경도 못 막은 공포',body:'빈 거리에 불안이 번진다. 병상과 연대가 필요한데, 정치는 어디에 있나!',image:0},
 {tag:'평화',headline:'광장을 메운 “대화하라!”',body:'시민들이 포성보다 악수를 원한다. 이제 지도자들이 답할 차례다.',image:4},
 {tag:'기후 위기',headline:'하늘이 뒤집혔다, 도시가 잠겼다',body:'폭풍이 평범한 하루를 삼켰다. 무너진 길 앞에서 시민들의 한숨이 깊다.',image:1},
 {tag:'사회',headline:'빈 일터, 늙어가는 거리',body:'일할 손은 줄고 돌봄의 짐은 커진다. 내일을 맡길 사람은 어디에 있나!',image:3},
 {tag:'기술',headline:'기계가 출근하는 시대!',body:'새 산업의 문이 활짝 열렸다. 환호 뒤에는 일자리를 걱정하는 목소리도 있다.',image:2}
];
function eventArticle(index:number):Article{return {...(EVENT_COPY[index]||{tag:'위기 속보',headline:EVENTS[index].title,body:EVENTS[index].description,image:index===7?3:index===10?2:1})};}
function forecastArticle(r:Room):Article{
 if(r.round>=10)return {tag:'마지막 국면',headline:'마지막 선택, 기록으로 남는다',body:'지도자들의 선택이 거리의 기억으로 남는다. 번영과 평화, 무엇을 지켜냈는가?',image:4};
 const hints=['해협에 군함이 모인다. 평온한 바다를 믿어도 될까?','항구에 주문이 몰린다. 다시 교역의 바람이 불 조짐이다.','낯선 감염 소식이 국경을 넘는다. 보건 당국은 긴장을 늦추지 말라!','거리마다 대화의 깃발이 오른다. 평화를 향한 큰 물결이 다가온다.','기상 관측소의 경고가 심상치 않다. 도시를 지킬 준비는 됐는가?','구인 공고가 늘어도 지원자는 뜸하다. 돌봄과 일터가 함께 흔들릴 조짐이다.','연구소와 공장에 새 바람이 분다. 거대한 산업 변화가 문을 두드린다.'];
 const i=r.nextEvent??r.event;return {tag:'다음 국면 예고',headline:'심상치 않은 전조',body:hints[i]||`${EVENTS[i].title}의 조짐이 짙어진다. 시민의 일상이 무너지기 전에 대응해야 한다!`,image:eventArticle(i).image};
}
function editions(r:Room,stories:Article[]):Edition[]{
 const frames=[['안보가 먼저다','경계 없는 낙관은 금물.'],['시장은 기다리지 않는다','새 판을 읽는 자가 기회를 잡는다.'],['우리 삶은 우리가 지킨다','바깥의 약속보다 우리 터전부터!'],['신뢰를 잃으면 모두가 진다','지금 필요한 건 서로의 목소리다.']];
 return r.players.map(p=>({nation:p.nation,figures:damageFigures(r,p),articles:stories.map((s,i)=>({...s,headline:i===0?`${frames[p.nation][0]} — ${s.headline}`:s.headline,body:s.body}))}));
}
function publishExtra(r:Room,title:string,stories:Article[]){
 r.bulletins??=[];r.bulletins.push({id:crypto.randomUUID(),round:r.round,title,body:'',impacts:[],editions:editions(r,stories),breaking:true,at:r.clock});r.bulletins=r.bulletins.slice(-32);
}
function snapshot(r:Room){return r.players.map(p=>({nation:p.nation,stats:{...p.stats}}));}
const VOICES:Record<Stat,[string,string]>={
 economy:['가게 계산기가 오랜 휴가를 마치고 복귀하겠네요. 이번엔 경기 회복이 뉴스 자막을 넘어 우리 매출 장부까지 출근해 주길 바랍니다.','경제 전망은 맑음이라는데 우리 가게만 장마인가 봐요. 전망대 위치를 골목 상권 쪽으로 조금 옮겨 주시면 좋겠습니다.'],
 support:['오랜만에 박수 칠 일이 생겼네요. 손뼉이 자동 결제되는 건 아니니, 다음 달에도 같은 서비스 품질 부탁합니다.','정부 발표에는 느낌표가 많은데 시민 머리에는 물음표가 많네요. 기자회견 한 번쯤은 질문에 마침표를 찍어 주시면 좋겠습니다.'],
 military:['준비는 든든할수록 좋죠. 다만 장비 자랑 다음 순서는 평화 유지였으면 합니다. 사용 후기까지 쓰고 싶지는 않거든요.','안보 회의는 매일 열리는데 현장 준비는 아직 로딩 중인가 봐요. 국민 안심 버튼보다 점검 완료 버튼을 먼저 눌러 주세요.'],
 infrastructure:['드디어 출근길이 장애물 코스에서 도로로 돌아오네요. 개통식 리본보다 유지보수 일정이 길었으면 좋겠습니다.','도로도 전기도 쉬는데 고지서만 성실하게 출근하네요. 공공 서비스에도 고지서 정도의 근무 태도를 부탁합니다.'],
 relations:['이웃과 악수했으니 이제 장부에서도 반가운 소식이 오겠죠. 외교 사진 앨범만 부자가 되는 결말은 아니길 바랍니다.','외교가 매워질 때마다 시민 지갑이 물을 찾네요. 발언의 매운맛 조절 버튼은 없을까요? 식비까지 같이 타고 있습니다.']
};
function recordChanges(r:Room,before:ReturnType<typeof snapshot>,cause:string,privateTo?:number[]){
 ensureNarrative(r);const alerts:Article[]=[];
 for(const p of r.players){const prev=before.find(x=>x.nation===p.nation);if(!prev)continue;
 const changes=(Object.keys(STAT_NAMES) as Stat[]).map(stat=>({stat,delta:p.stats[stat]-prev.stats[stat]})).sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta));
 const largest=changes[0];if(!largest||largest.delta===0)continue;
 const crossing=changes.find(x=>x.delta!==0&&((p.stats[x.stat]>=90&&prev.stats[x.stat]<90)||(p.stats[x.stat]<=10&&prev.stats[x.stat]>10)));
 const urgent=Math.abs(largest.delta)>=15||!!crossing;const subject=crossing||largest;
 r.reactions!.push({id:crypto.randomUUID(),nation:p.nation,at:r.clock,urgent,speaker:citizenFor(p.nation,r.round,r.voiceCounter=(r.voiceCounter||0)+1),text:`${cause}! ${VOICES[largest.stat][largest.delta>0?0:1]}`,...(privateTo?{privateTo}:{})});
 const key=`${p.nation}:${subject.stat}`;
 if(urgent&&!privateTo&&(r.pressCooldown![key]===undefined||r.clock-r.pressCooldown![key]>=12000)){
  r.pressCooldown![key]=r.clock;
  const up=subject.delta>0;
  alerts.push({tag:'긴급 현장',headline:`${short(p.nation)}, ${STAT_NAMES[subject.stat]} ${up?'판도가 뒤집혔다!':'위태로운 급변!'}`,body:`${cause} 이후 거리의 공기가 달라졌다. ${VOICES[subject.stat][up?0:1]}`,image:subject.stat==='military'?5:subject.stat==='relations'?4:subject.stat==='infrastructure'?up?2:1:subject.stat==='support'?3:2});
 }
 }
 r.reactions=r.reactions!.slice(-48);
 if(alerts.length)publishExtra(r,'긴급 호외',[...alerts.slice(0,3),forecastArticle(r)].slice(0,4));
}

export const POLICY_SECONDS=24;
export function changeDegree(n:number){const x=Math.abs(n);return `${x>=15?'크게':x>=8?'상당히':'소폭'} ${n>=0?'상승':'하락'}`;}
export function budgetDegree(n:number){return n===0?'예산 소모 없음':n<=15?'적은 예산':n<=30?'중간 규모 예산':'많은 예산';}
export function describeEffect(e:Effect){return Object.entries(e).filter(([,v])=>v).map(([k,v])=>`${k==='money'?'예산':STAT_NAMES[k as Stat]} ${changeDegree(v!)}`).join(' · ');}
export function qualitativeText(text:string){return text.replace(/([+＋−-])\s*(\d+(?:\.\d+)?)/g,(_,sign,num)=>changeDegree(Number(num)*(sign==='+'||sign==='＋'?1:-1))).replace(/(\d+(?:\.\d+)?)\s*(%?)\s*(증가|상승|오릅니다|감소|하락|내려갑니다)/g,(_,num,_unit,verb)=>changeDegree(Number(num)*(/감소|하락|내려/.test(verb)?-1:1)));}
export function eventDescription(e:WorldEvent){const categories:Record<string,string>={domestic:'국내',public:'공개 외교',military:'군사',secret:'비밀 외교'};return `${eventArticle(EVENTS.indexOf(e)).body} ${describeEffect(e.effect)}. ${categories[e.category]} 행동 예산 부담 ${e.multiplier>1?'증가':'완화'}. ${NATIONS[e.nation].short} 추가 효과: ${describeEffect(e.local)}.`;}

export const COOPERATION=[
 {id:'trade',name:'무역·공급망 협력',contribution:12,effect:{economy:8,relations:6},protection:'finance',description:'양국 경제와 신뢰를 개선하고 금융 충격에 대비합니다.',news:'막혔던 거래의 길을 함께 연다. 상인들은 오래갈 약속이기를 바란다.',image:4},
 {id:'health',name:'보건·방역 협력',contribution:16,effect:{infrastructure:6,support:5,relations:5},protection:'health',description:'의료 기반을 보강하고 이후 팬데믹 인명 피해를 줄입니다.',news:'국경을 넘은 의료 협력! 병상을 기다리는 시민들에게 작은 희망이 생겼다.',image:0},
 {id:'research',name:'기술·디지털 공동 연구',contribution:18,effect:{infrastructure:10,economy:4,relations:4},protection:'cyber',description:'기술 기반과 경제를 개선하고 사이버 피해에 대비합니다.',news:'연구실의 벽을 허문 두 나라. 기술이 시민의 삶까지 바꿀 수 있을까?',image:2},
 {id:'disaster',name:'기후·재난 공동 대응',contribution:16,effect:{infrastructure:8,relations:6},protection:'disaster',description:'기반 시설을 보강하고 이후 자연재해 피해를 줄입니다.',news:'무너진 도로를 함께 세운다. 재난 앞에 국경은 잠시 낮아졌다.',image:1},
 {id:'education',name:'교육·일자리 교류',contribution:12,effect:{support:8,economy:3,relations:5},protection:'food',description:'재취업을 지원하고 민생과 경제를 개선합니다.',news:'다시 일할 기회를 나누다. 교실과 일터를 잇는 약속에 청년들이 주목한다.',image:3}
];
export const CITIZENS=["73세 김○수 · 은퇴 노동자", "29세 박○진 · 취업 준비생", "46세 이○호 · 소상공인", "34세 정○은 · 간호사", "61세 최○숙 · 시장 상인", "22세 한○민 · 대학생", "41세 윤○석 · 버스 기사", "57세 장○희 · 농민", "38세 임○우 · 소방관", "26세 오○림 · 배달 기사", "68세 서○자 · 은퇴 교사", "32세 신○준 · 게임 개발자", "49세 송○경 · 제빵사", "24세 조○빈 · 공장 노동자", "55세 문○철 · 어민", "43세 백○영 · 식당 주인", "30세 남○현 · 물류 기사", "65세 홍○남 · 경비원", "27세 유○아 · 디자이너", "36세 고○진 · 보육 교사", "52세 안○호 · 전기 기사", "45세 전○미 · 사서", "71세 노○석 · 퇴직 기술자", "23세 양○은 · 대학원생", "39세 류○성 · 철도 기관사", "58세 배○숙 · 요양 보호사", "33세 하○준 · 환경 연구원", "47세 성○원 · 정비사", "28세 진○경 · 콜센터 상담원", "62세 차○수 · 지역 해설사", "40세 방○연 · 약사", "50세 우○민 · 항만 노동자", "21세 심○희 · 아르바이트생", "35세 구○호 · 택배 기사", "59세 민○란 · 세탁소 주인", "31세 도○진 · 사회복지사"];
export const POLICY_OPINIONS:[string,string,string][][]=[
 [
  ['국경부터 든든해야 잠이라도 편히 자지!','그 예산으로 일자리부터 만들면 안 됩니까?','일자리도 나라가 안전해야 지키는 거요. 그래도 생활비는 챙겨 줘야지!'],
  ['맨날 으르렁대지 말고 이제 말로 좀 풉시다.','상대가 약속을 안 지키면 어쩌려고요?','의심만 하다간 평생 대화 한 번 못 해요!'],
  ['수출해서 나라 살림 좀 나아지면 좋겠네.','그 무기가 누군가의 집을 무너뜨릴 수도 있잖아요.','먹고사는 일도 중요하지만, 돈 되는 일이라고 다 해도 되는 건 아니지.']
 ],
 [
  ['시장 문이 열리면 우리 물건도 멀리 팔겠네요!','큰 회사만 웃고 작은 가게는 밀려나는 거 아녜요?','기회는 열되, 동네 가게 대책도 같이 내놔야지.'],
  ['우리 가게부터 살려야지, 관세가 필요해요!','수입품 비싸지면 장바구니는 누가 책임져요?','싼 물건만 찾다 우리 일터가 사라지는 것도 곤란하죠.'],
  ['아플 때 병원 갈 걱정부터 줄여 주는 게 정치죠.','좋은 건 알겠는데 나중에 예산은 감당돼요?','지금 무너지는 사람부터 살리고 방법을 찾읍시다!']
 ],
 [
  ['우리 땅 자원인데 왜 남 좋은 일만 합니까!','투자자 다 떠나면 일자리도 줄지 않나요?','주인 노릇을 하되 운영할 준비부터 제대로 해야지.'],
  ['남한테만 기대지 말고 우리 기술을 키워야지!','공장 완성될 때까지 당장 생활비는요?','멀리 보는 것도 좋지만 오늘의 살림도 놓치지 맙시다.'],
  ['밖에서 투자해 준다니 일자리가 생기겠죠?','결국 결정권까지 넘기는 건 아닌지 걱정돼요.','돈만 받지 말고 우리 노동자 조건도 걸어야죠!']
 ],
 [
  ['싸움 말리는 나라가 있어야 세계가 굴러가지.','남의 갈등에 끼었다 우리만 손해 보는 거 아니에요?','모른 척한다고 불똥이 안 튀는 건 아니잖아요.'],
  ['서로 다른 사람도 한 동네라는 마음은 필요해요.','구호만 외치면 먹고사는 게 해결됩니까?','행사로 끝내지 말고 실제로 서로 챙기자는 거죠.'],
  ['평화도 지킬 힘이 있어야 가능한 거요!','갑자기 군비를 늘리면 이웃은 배신으로 보겠죠.','안전과 신뢰, 둘 다 놓치지 않는 설명이 필요해요.']
 ]
];
function voice(r:Room,nation:number,text:string,urgent=false,privateTo?:number[],speaker?:string,batch?:string){r.reactions??=[];r.reactions.push({id:crypto.randomUUID(),nation,text,at:r.clock,urgent,speaker:speaker||citizenFor(nation,r.round,r.voiceCounter=(r.voiceCounter||0)+1),batch,...(privateTo?{privateTo}:{})});r.reactions=r.reactions.slice(-100);}
function policyReaction(r:Room,nation:number,choice:number){const batch=crypto.randomUUID(),c=policyChoices(byNation(r,nation))[choice];policyOpinions(c,nation,choice).slice(0,2).forEach((text,i)=>voice(r,nation,text,false,undefined,policySpeaker(c,nation,r.round,i),batch));}
function actionReaction(action:string,topic?:string){const theme=['war','mobilize','ultimatum'].includes(action)?'military':['economy','sanction'].includes(action)?'finance':action==='infrastructure'?'energy':action==='support'?'welfare':'diplomacy';return `${topic?COOPERATION.find(x=>x.id===topic)?.name+' 소식이네요. ':''}${WITTY_DEBATES[theme][action==='war'?2:1]}`;}
function addLosses(p:Player,title:string,deaths:number,unemployed:number){deaths=Math.max(0,Math.min(deaths,NATIONAL_POPULATIONS[p.nation]-(p.deaths||0)));const workforce=Math.max(0,Math.floor((NATIONAL_POPULATIONS[p.nation]-(p.deaths||0)-deaths)*.5));unemployed=Math.max(0,Math.min(unemployed,workforce-(p.unemployed||0)));p.deaths=(p.deaths||0)+deaths;p.unemployed=Math.min(workforce,(p.unemployed||0)+unemployed);p.eventLosses??={};const prev=p.eventLosses[title]||{deaths:0,unemployed:0};p.eventLosses[title]={deaths:prev.deaths+deaths,unemployed:prev.unemployed+unemployed};}
function applyDisaster(r:Room,e:WorldEvent,affected=r.players){
 const batch=crypto.randomUUID();
 for(const p of affected){const readiness=p.prepared?.[e.crisis||'']||0;const resilience=Math.max(.25,1-p.stats.infrastructure/180-readiness/100);
 const deaths=Math.round((e.deaths||0)*resilience*NATIONAL_POPULATIONS[p.nation]/(r.event===4?1000000:100000)),unemployed=Math.round(employmentScale(p,e.unemployed||0)*Math.max(.3,1-p.stats.economy/200-readiness/120));addLosses(p,e.title,deaths,unemployed);
 if(deaths||unemployed){voice(r,p.nation,`${e.title} 이후 우리나라 누적 사망 ${formatPeople(p.deaths||0)}명, 사건 관련 실업 ${formatPeople(p.unemployed||0)}명이라니요. 숫자 하나하나가 사람의 삶입니다.`,true,undefined,citizenFor(p.nation,r.round,4),batch);voice(r,p.nation,e.crisis==='health'?'대책 발표 자료는 병원 침대보다 빨리 늘어나네요. 서류로 이불을 만들 수는 없으니, 이번엔 인력과 물자도 같은 속도로 부탁합니다.':'복구 계획은 벌써 완공된 분위기인데 현장은 아직 삽을 기다립니다. 발표 자료의 진행률을 도로에도 복사해 붙일 수 있으면 좋겠네요.',true,undefined,citizenFor(p.nation,r.round,5),batch);}
 }
 if(e.deaths){const safest=[...affected].sort((a,b)=>(a.eventLosses?.[e.title]?.deaths||0)-(b.eventLosses?.[e.title]?.deaths||0))[0];for(const p of affected)if((p.eventLosses?.[e.title]?.deaths||0)>(safest.eventLosses?.[e.title]?.deaths||0)+10)voice(r,p.nation,`${short(safest.nation)}는 피해를 더 줄였다는데, 우리도 의료와 기반 시설에 신경 써야 하는 것 아닌가요?`,true,undefined,citizenFor(p.nation,r.round,6),batch);}
}
function damageFigures(r:Room,p:Player){return {deaths:p.deaths||0,unemployed:p.unemployed||0,worldDeaths:r.players.reduce((n,x)=>n+(x.deaths||0),0),worldUnemployed:r.players.reduce((n,x)=>n+(x.unemployed||0),0),eventTitle:currentEventTitle(r),eventDeaths:p.eventLosses?.[currentEventTitle(r)]?.deaths||0,worldEventDeaths:r.players.reduce((n,x)=>n+(x.eventLosses?.[currentEventTitle(r)]?.deaths||0),0)};}
function publicBacklash(r:Room,actor:number,target:number,action:string){
 const pair=r.relations?.find(x=>x.a===Math.min(actor,target)&&x.b===Math.max(actor,target));const friendly=(pair?.value||0)>=15;
 if(!friendly&&!['war','ultimatum'].includes(action))return;
 const groups=r.players.filter(p=>p.nation===target||p.nation!==actor&&(r.relations||[]).some(x=>(x.a===p.nation&&x.b===target||x.b===p.nation&&x.a===target)&&x.value>=15));
 for(const citizenNation of groups){if(r.boycotts!.some(b=>b.from===citizenNation.nation&&b.target===actor&&b.until>r.clock))continue;
 r.boycotts!.push({from:citizenNation.nation,target:actor,until:r.clock+r.duration*2000});const aggressor=byNation(r,actor);effect(aggressor,{economy:-6,support:-3});effect(citizenNation,{support:3,economy:-2});
 voice(r,citizenNation.nation,`${short(actor)} 물건은 당분간 안 사겠습니다. ${friendly?'친하다더니 갑자기 이러는 게 말이 됩니까!':'우리 이웃을 몰아붙이는 걸 보고만 있을 순 없죠!'}`,true);
 voice(r,actor,`${short(citizenNation.nation)}에서 불매한다네요. 외교 갈등에 우리 수출 주문까지 끊겼습니다!`,true);
 publishExtra(r,'국경을 넘은 불매 운동',[{tag:'시민 행동',headline:`${short(citizenNation.nation)} 시민 “${short(actor)} 제품 안 산다”`,body:friendly?'믿었던 이웃의 강압에 배신감이 터졌다. 불매가 수출과 상점으로 번진다.':'강압 외교에 소비자들이 맞섰다. 국경 너머 갈등이 장바구니를 바꾸고 있다.',image:3}]);
 log(r,`${short(citizenNation.nation)} 시민의 ${short(actor)} 제품 불매 운동. 수출 수입이 한동안 크게 줄어듭니다.`,citizenNation.nation,'boycott');}
}
function solidarity(r:Room,actor:number,target:number){const pair=r.relations?.find(x=>x.a===Math.min(actor,target)&&x.b===Math.max(actor,target));if((pair?.value||0)<15)return;const key=`solidarity:${actor}:${target}`;if(r.pressCooldown![key]&&r.clock-r.pressCooldown![key]<r.duration*1000)return;r.pressCooldown![key]=r.clock;effect(byNation(r,target),{money:6,support:3});voice(r,target,`${short(actor)}의 원조에 시민들까지 모금에 나섰대요. 이런 이웃이라면 믿고 함께해야죠!`,true);publishExtra(r,'이웃을 위한 시민 모금',[{tag:'시민 연대',headline:`${short(actor)}·${short(target)}, 시민이 잇는 우정`,body:'정부의 원조가 자발적인 모금으로 이어졌다. 위기 속에서 오래갈 신뢰가 자란다.',image:4}]);}
export function jobName(j:Job){return j.action==='crisis-response'?`위기 대응 · ${CRISIS_RESPONSES.find(x=>x.id===j.topic)?.name||''}`:j.action==='policy'?`${(j.policy||CHOICES[j.actor][j.choice!])?.label||'정책'} 시행`:ACTIONS.find(x=>x.id===j.action)?.name||'행동';}
export function actionDescription(id:string){const lines:Record<string,string>={statement:'국제 관계 개선 · 국민 신뢰 소폭 상승 · 세계 긴장 완화',treaty:'선택한 분야에서 공동 사업을 추진합니다. 상대의 동의와 예산 분담이 필요합니다.',aid:'상대 경제·예산 지원 · 자국 신뢰 개선 · 국내 지지 소폭 하락',sanction:'상대 경제에 큰 압박 · 자국 경제와 신뢰도 손상 · 시민 불매 위험',message:'두 국가에만 전달 · 전송 대기 후 재사용 가능 · 240자 이내',backchannel:'선택한 분야를 비공개로 협력합니다. 제안과 결과는 당사자만 열람합니다.',mobilize:'군사력 상당히 상승 · 지지 소폭 상승 · 국제 신뢰 하락',ultimatum:'양보 시 상대 예산 일부 이전 · 거부 시 긴장 고조 · 불매 운동 위험',war:'양국에 큰 군사·경제·인프라 피해와 인명 피해 · 외교 신뢰 급락',economy:'경제 상당히 상승 · 인프라 소폭 개선 · 실업 완화',support:'국민 지지 크게 상승 · 실업 소폭 완화',infrastructure:'인프라 크게 개선 · 경제 소폭 상승'};return lines[id]||'';}

// Server-side, deterministic score-seeking AI. Uses its own pending work and public
// state only; no future event lookup, hidden opponent orders, or extra resources.
const AI_EFFECTS:Record<string,Effect>={
 statement:{relations:7,support:3},mobilize:{military:13,support:3,relations:-6},
 economy:{economy:13,infrastructure:3},support:{support:15},infrastructure:{infrastructure:16,economy:4},
 aid:{relations:10,support:-3}
};
function aiScore(p:Player){const s=p.stats;return .1*(s.economy+s.infrastructure)+.2*(s.support+s.military+s.relations+s[NATIONS[p.nation].goal]);}
function aiProjection(r:Room,p:Player){const projected={...p,stats:{...p.stats}};for(const j of r.jobs.filter(j=>j.actor===p.nation).sort((a,b)=>a.end-b.end||a.start-b.start)){
 const e=j.action==='policy'?(j.policy||CHOICES[p.nation][j.choice!]).effect:AI_EFFECTS[j.action];if(e)effect(projected,{...e,money:0});
 }return projected;}
function aiMoneyValue(r:Room){return r.round===10?.015:r.round>=8?.045:.085;}
function aiValue(r:Room,p:Player,e:Effect){const after={...p,stats:{...p.stats}};effect(after,e);const goal=NATIONS[p.nation].goal,threshold=p.nation===0?65:p.nation===2?60:70;
 const demand=r.round<10?.6*(Number(after.stats[goal]>=threshold)-Number(p.stats[goal]>=threshold)):0;
 return aiScore(after)-aiScore(p)+demand+(e.money||0)*aiMoneyValue(r);
}
function runAI(r:Room){for(const p of r.players.filter(p=>p.isAI)){
 runStrategyAI(r,p);
 // Receiving cooperation costs the same contribution as for a human. Refusing
 // an ultimatum is better for this game's own-score objective than conceding.
 for(const offer of r.offers.filter(o=>o.to===p.nation&&o.status==='pending')){
 const topic=COOPERATION.find(x=>x.id===(offer.topic||'trade'))!;
 const accept=offer.kind!=='ultimatum'&&p.money>=topic.contribution&&aiValue(r,aiProjection(r,p),{...topic.effect,money:-topic.contribution})>0;
 applyCommand(r,p.id,{type:'respond',offerId:offer.id,accept},r.clock);
 }
 if(p.choice===null){let choice=-1,best=0;const projected=aiProjection(r,p);
 policyChoices(p).forEach((c,i)=>{if(p.money<Math.max(0,-(c.effect.money||0)))return;const value=aiValue(r,projected,c.effect);if(value>best){best=value;choice=i;}});
 applyCommand(r,p.id,{type:'choice',choice},r.clock);
 }
 if(r.jobs.filter(j=>j.actor===p.nation&&j.action!=='policy').length>=4)continue;
 const projected=aiProjection(r,p),end=r.deadline+(10-r.round)*r.duration*1000;
 let best=0,selected:Command|undefined;
 for(const a of ACTIONS){const cost=price(r,a,p.nation);if(cost>p.money||r.clock+a.seconds*1000>end||r.jobs.some(j=>j.actor===p.nation&&j.action===a.id))continue;
 if(AI_EFFECTS[a.id]){
 const value=aiValue(r,projected,{...AI_EFFECTS[a.id],money:-cost});
 if(value>best){best=value;selected={type:'action',action:a.id,...(a.target?{target:r.players.find(x=>x.nation!==p.nation)!.nation}:{})};}
 }else if(a.id==='treaty'){
 for(const target of r.players.filter(x=>x.nation!==p.nation)){
 if((p.history[`aiOffer:${target.nation}`]||-10)>r.round-2||r.offers.some(o=>o.status==='pending'&&(o.from===p.nation&&o.to===target.nation||o.from===target.nation&&o.to===p.nation)))continue;
 for(const topic of COOPERATION){if(target.money<topic.contribution)continue;
 // Estimate acceptance from visible national needs, without reading target jobs.
 if(aiValue(r,target,{...topic.effect,money:-topic.contribution})<=0)continue;
 const value=aiValue(r,projected,topic.effect)*(target.isAI?.9:.65)-cost*aiMoneyValue(r);
 if(value>best){best=value;selected={type:'action',action:'treaty',target:target.nation,topic:topic.id};}
 }
 }
 }
 }
 if(selected){applyCommand(r,p.id,selected,r.clock);if(selected.action==='treaty')p.history[`aiOffer:${selected.target}`]=r.round;}
}}

export type ClimateIncident={kind:number;nation:number;round:number;at:number};
export const CLIMATE_TYPES:{name:string;nations:number[];icon:string;effect:Effect;deaths:number;unemployed:number;story:string}[]=[
 {name:'기록적 폭설·한파',nations:[0],icon:'snow',effect:{infrastructure:-15,economy:-7,support:-6},deaths:42,unemployed:65,story:'산악 도로가 눈에 파묻히고 난방마저 끊겼다. 구조를 기다리는 집들의 창문이 얼어붙는다.'},
 {name:'빙하호 붕괴 홍수',nations:[0],icon:'flood',effect:{infrastructure:-19,economy:-8,support:-7},deaths:78,unemployed:80,story:'녹아내린 빙하의 물이 계곡을 덮쳤다. 안전하다던 마을이 하루아침에 급류에 잠겼다.'},
 {name:'초강력 태풍',nations:[1],icon:'storm',effect:{infrastructure:-17,economy:-10,support:-6},deaths:65,unemployed:95,story:'항구의 크레인이 꺾이고 교역선이 멈췄다. 바다의 경고를 무시한 대가가 도시를 덮친다.'},
 {name:'해수면 상승·폭풍 해일',nations:[1],icon:'wave',effect:{infrastructure:-16,economy:-9,support:-8},deaths:58,unemployed:85,story:'방파제를 넘은 바닷물이 시장과 주거지를 삼켰다. 시민들은 더는 일회성 재난이 아니라고 외친다.'},
 {name:'극한 폭염',nations:[2],icon:'heat',effect:{economy:-10,support:-12,infrastructure:-6},deaths:70,unemployed:50,story:'달아오른 거리에 노동자들이 쓰러진다. 에어컨 없는 집과 작업장부터 위기가 파고든다.'},
 {name:'장기 가뭄·물 부족',nations:[2],icon:'drought',effect:{economy:-13,support:-10,infrastructure:-5},deaths:35,unemployed:100,story:'메마른 저수지에 바닥이 드러났다. 농장과 공장이 동시에 물을 기다리며 멈춰 섰다.'},
 {name:'고원 대형 산불',nations:[3],icon:'fire',effect:{infrastructure:-16,support:-9,economy:-8},deaths:72,unemployed:75,story:'말라붙은 숲이 불길의 길이 됐다. 대피 방송 속에서 집과 일터가 검은 연기에 잠긴다.'},
 {name:'집중호우·산사태',nations:[3],icon:'landslide',effect:{infrastructure:-18,economy:-7,support:-8},deaths:82,unemployed:70,story:'빗물을 버티지 못한 산비탈이 무너졌다. 길이 끊긴 마을에서 구조 요청이 쏟아진다.'}
];
type EventState=Pick<Room,'event'|'round'|'climate'|'arc'>;
export function currentEventTitle(r:EventState){return r.event===4&&r.climate?.round===r.round?CLIMATE_TYPES[r.climate.kind].name:EVENTS[r.event].title;}
export function currentEventDescription(r:EventState){if(r.event===4&&r.climate?.round===r.round){const c=CLIMATE_TYPES[r.climate.kind];return `${short(r.climate.nation)} 지역 재난 · ${c.story} 피해국 ${describeEffect(c.effect)}. 피해국 국내 행동 예산 부담 증가.`;}return eventDescription(EVENTS[r.event]);}
function currentEventArticle(r:Room):Article{if(r.event===4&&r.climate?.round===r.round){const c=CLIMATE_TYPES[r.climate.kind];return {tag:'지역 기후 재난',headline:`${short(r.climate.nation)}, ${c.name}에 일상이 무너졌다!`,body:c.story,image:1};}return eventArticle(r.event);}
export function crisisMarkers(r:EventState&Pick<Room,'status'|'deadline'|'duration'>&{players:{nation:number}[]}){
 if(r.status!=='playing')return [];
 const at=r.deadline-r.duration*1000;
 const markers=r.event===2||r.arc?.status==='active'?r.players.map(p=>({id:`health:${at}:${p.nation}`,nation:p.nation,kind:'health',label:'팬데믹',at})):[];
 if(r.event===4&&r.climate?.round===r.round){const c=CLIMATE_TYPES[r.climate.kind];markers.push({id:`climate:${r.climate.at}:${r.climate.nation}`,nation:r.climate.nation,kind:c.icon,label:c.name,at:r.climate.at});}
 return markers;
}

// Choices are fixed for the current turn and persisted with the room. A queued
// policy keeps its own snapshot so a new turn cannot change a paid-for effect.
export function policyChoices(p:{nation:number;policies?:Choice[]}){return p.policies?.length===3?p.policies:CHOICES[p.nation];}
export function policyImage(c:Choice,nation:number,index:number){return c.image||`/policy-${nation*3+index}.webp`;}
export function policyOpinions(c:Choice,nation:number,index:number):[string,string,string]{const legacy=CHOICES[nation]?.findIndex(x=>x.label===c.label);return [...(POLICY_DIALOGUE[c.id||'']||((legacy??-1)>=0?POLICY_OPINIONS[nation][legacy!]:c.opinions)||POLICY_OPINIONS[nation][index])];}
export function policySpeaker(c:Choice,nation:number,round:number,index:number){const slot=Object.keys(POLICY_DIALOGUE).indexOf(c.id||'');return citizenFor(nation,round,Math.max(0,slot)*3+index);}
function policy(id:string,label:string,effect:Effect,tension:number,art:number):Choice{return {id,label,detail:'',effect,tension,image:`/policy-${art}.webp`,opinions:[...POLICY_DIALOGUE[id]]};}
export const POLICY_BANK:Record<string,Choice>={
 hospitals:policy('hospitals','긴급 병상·의료 인력 확충',{infrastructure:13,support:8,money:-30},-1,5),
 quarantine:policy('quarantine','집중 방역·모임 제한',{support:9,infrastructure:6,economy:-7,money:-12},1,9),
 healthAid:policy('healthAid','방역 물자 공동 조달',{relations:12,infrastructure:7,money:-22},-4,10),
 evacuate:policy('evacuate','위험 지역 강제 대피',{support:12,economy:-5,infrastructure:5,money:-15},0,5),
 rebuild:policy('rebuild','긴급 복구·구호 거점 설치',{infrastructure:18,support:7,money:-35},-1,7),
 ration:policy('ration','필수 물자 배급·사용 제한',{support:9,economy:-6,infrastructure:4,money:-8},2,6),
 relief:policy('relief','취약 가구 긴급 생활 지원',{support:16,economy:3,money:-28},-1,5),
 credit:policy('credit','소상공인 저리 긴급 대출',{economy:14,support:4,money:-26},0,3),
 work:policy('work','공공 일자리·재취업 사업',{economy:10,support:10,infrastructure:3,money:-30},-1,8),
 housing:policy('housing','공공 임대·긴급 주거 공급',{support:13,infrastructure:8,money:-32},0,5),
 repair:policy('repair','노후 교량·도로 안전 보강',{infrastructure:17,economy:3,money:-29},0,7),
 grid:policy('grid','전력망·분산 에너지 투자',{infrastructure:15,economy:6,money:-32},-1,7),
 defend:policy('defend','방어 장비 현대화',{military:16,support:4,relations:-5,money:-28},4,0),
 patrol:policy('patrol','국경 경계·민방위 훈련',{military:10,support:3,economy:-3,money:-14},3,0),
 mediation:policy('mediation','국제 중재·긴급 정상 회담',{relations:17,support:4,money:-22},-7,9),
 openTrade:policy('openTrade','교역 장벽 완화·항로 개방',{economy:11,relations:10,support:-4,money:-20},-3,3),
 reserve:policy('reserve','식량·필수 자원 비축',{infrastructure:9,support:7,economy:-3,money:-18},0,6),
 farm:policy('farm','가뭄 대응 관개·농업 지원',{infrastructure:12,economy:8,money:-27},-1,7),
 automation:policy('automation','중소기업 자동화 전환',{economy:16,infrastructure:8,support:-8,money:-30},0,7),
 retrain:policy('retrain','디지털 직무 전환 교육',{support:10,economy:8,infrastructure:6,money:-25},-1,8),
 cyber:policy('cyber','공공망 보안·백업 복구',{infrastructure:15,relations:5,money:-25},-2,7),
 pension:policy('pension','돌봄 인력·노후 안전망',{support:15,infrastructure:6,money:-30},-1,5),
 migration:policy('migration','인력 유입·정착 지원',{economy:13,infrastructure:5,support:-6,money:-18},-2,10),
 bonds:policy('bonds','긴급 국채·공공 자금 조달',{money:24,support:-5,economy:-3},1,6),
 tax:policy('tax','초과 이익 한시 부담금',{money:20,support:5,economy:-8},1,6),
 rescue:policy('rescue','국제 구조대·구호 물자 파견',{relations:15,support:-3,money:-20},-4,10),
 climateReady:policy('climateReady','지역 기후 위험 사전 점검',{infrastructure:10,support:5,money:-16},-1,7)
};
const EVENT_POLICIES=[['defend','patrol','mediation'],['openTrade','credit','automation'],['hospitals','quarantine','healthAid'],['mediation','openTrade','rescue'],['rescue','climateReady','reserve'],['pension','migration','retrain'],['automation','retrain','cyber'],['credit','bonds','tax'],['reserve','farm','relief'],['grid','repair','reserve'],['cyber','retrain','mediation'],['evacuate','rebuild','housing'],['housing','migration','relief']];
const NEED_POLICIES:Record<Stat,string[]>={economy:['credit','work'],support:['relief','housing'],military:['defend','patrol'],infrastructure:['repair','grid'],relations:['mediation','openTrade']};
export function generatePolicies(r:Room,p:Player):Choice[]{
 const local=r.event===4&&r.climate?.nation===p.nation;
 const pool=local?['evacuate','rebuild','ration']:r.arc?.status==='active'?EVENT_POLICIES[2]:EVENT_POLICIES[r.event];
 const offset=(r.round+p.nation)%pool.length;
 const chosen=[pool[offset],pool[(offset+1)%pool.length]].map(id=>({...structuredClone(POLICY_BANK[id]),context:local?`${CLIMATE_TYPES[r.climate!.kind].name} · 자국 피해 대응`:`${EVENTS[r.event].title} · 이번 정세 대응`}));
 // A third route responds to treasury pressure or the country's weakest area.
 const needs=(Object.keys(STAT_NAMES) as Stat[]).sort((a,b)=>p.stats[a]-p.stats[b]);
 const candidates=p.money<25?['bonds','tax',...NEED_POLICIES[needs[0]]]:needs.flatMap(k=>NEED_POLICIES[k]);
 const available=candidates.filter(id=>!chosen.some(c=>c.id===id));const id=available[(r.round+p.nation)%Math.min(2,available.length)];
 chosen.push({...structuredClone(POLICY_BANK[id]),context:['bonds','tax'].includes(id)?'빠듯한 국고 · 재원 확보':`${STAT_NAMES[needs.find(stat=>NEED_POLICIES[stat].includes(id))!]} 보완 · 국내 현안`});
 return chosen;
}

// Fictional population scales for gameplay, not real-world statistical rates.
export const NATIONAL_POPULATIONS=[18000000,32000000,24000000,12000000];
export const formatPeople=(n:number)=>Math.round(n).toLocaleString('ko-KR');
function employmentScale(p:Player,units:number){return Math.round(units*NATIONAL_POPULATIONS[p.nation]/10000);}
export type IncidentImpact={nation:number;changes:{stat:Stat;delta:number}[];money:number;deaths:number;unemployed:number};
export type Incident={id:string;at:number;round:number;kind:'crisis'|'war-declared'|'battle';title:string;nations:number[];impacts:IncidentImpact[];winner?:number;loser?:number};
export type Dispatch={id:string;at:number;from:number;to:number;kind:string;title:string;text:string};
function incidentSnapshot(r:Room){return r.players.map(p=>({nation:p.nation,stats:{...p.stats},money:p.money,deaths:p.deaths||0,unemployed:p.unemployed||0}));}
function recordIncident(r:Room,kind:Incident['kind'],title:string,nations:number[],before:ReturnType<typeof incidentSnapshot>,result?:{winner:number;loser:number}){
 const impacts=r.players.filter(p=>nations.includes(p.nation)).map(p=>{const old=before.find(x=>x.nation===p.nation)!;return {nation:p.nation,changes:(Object.keys(STAT_NAMES) as Stat[]).map(stat=>({stat,delta:p.stats[stat]-old.stats[stat]})).filter(x=>x.delta!==0),money:p.money-old.money,deaths:(p.deaths||0)-old.deaths,unemployed:(p.unemployed||0)-old.unemployed};});
 r.incidents??=[];r.incidents.push({id:crypto.randomUUID(),at:r.clock,round:r.round,kind,title,nations,impacts,...result});r.incidents=r.incidents.slice(-40);
}
function dispatch(r:Room,from:number,to:number,kind:string,title:string,text:string){r.dispatches??=[];r.dispatches.push({id:crypto.randomUUID(),at:r.clock,from,to,kind,title,text});r.dispatches=r.dispatches.slice(-100);}
export function citizenFor(nation:number,round:number,index:number){return CITIZENS[(nation*7+round*3+index)%CITIZENS.length];}
export function prioritizeVoices(reactions:Reaction[],nation:number,limit=5){const own=reactions.filter(x=>x.nation===nation);const foreign=reactions.filter(x=>x.nation!==nation&&x.urgent&&!x.privateTo);return [...own.slice(0,limit),...(own.length>=2?foreign.slice(0,Math.max(0,Math.min(1,limit-own.length))):[])];}

const WITTY_DEBATES:Record<string,[string,string,string]>={
 health:['병상부터 늘리자는 데 찬성입니다. 대책 발표 자료는 이미 충분히 두꺼우니, 이번엔 병원 이불부터 두꺼워졌으면 좋겠네요.','병원 간판만 새것이고 의료진은 밤샘이면 곤란하죠. 건물은 준공식 하루로 끝나도 사람은 충전기에 꽂을 수 없으니까요.','방역과 생계를 양자택일로 내지 맙시다. 시민은 객관식 시험지가 아니라 둘 다 필요한 사람이라서요.'],
 disaster:['대피와 복구부터 합시다. 현수막은 바람보다 빨리 도착하던데, 이번엔 구호 물자도 같은 배송 서비스를 쓰면 좋겠습니다.','복구 예산이 업체 회식비로 길을 잃지 않았으면 해요. 길을 고치다가 돈의 행방까지 수색하는 일은 없어야죠.','회의실에선 물이 안 차니 결론이 느린가 봐요. 현장 사정도 회의 안건 말고 일정표 첫 줄에 올려 주세요.'],
 finance:['돈이 돌아야 가게도 돌아갑니다. 제 계산기는 아직 일할 의욕이 넘치는데 손님이 없어서 강제 휴가 중이거든요.','지원서류가 매출보다 많아지는 마법은 사양합니다. 가게를 살리려다 복사기만 호황을 누리면 좀 서운하잖아요.','오늘 빌린 돈의 청구서가 내일 오기는 하겠죠. 그래서 예산표에는 희망 사항 말고 상환 날짜도 크게 써 주세요.'],
 military:['장비 점검은 미리 해야죠. 나라 지키는 일을 시험 전날 벼락치기하듯 할 수는 없으니, 기본기부터 챙겨 봅시다.','군비는 특급 배송인데 생활 대책은 배송 준비 중이네요. 안보도 중요하지만 우리 냉장고와의 평화협정도 부탁합니다.','큰소리 대회로 국경을 지킬 수 있으면 확성기만 사면 되겠죠. 실제 대비와 대화도 예산표에 함께 넣읍시다.'],
 diplomacy:['이웃하고 손잡는 건 좋죠. 악수 사진은 충분히 찍었으니, 이제 우리 수출 상자에도 기념사진 찍을 기회를 주세요.','협정문이 두꺼울수록 지갑도 두꺼워지면 좋겠네요. 작은 글씨 속 부담만 시민 몫으로 숨겨 두지는 말아 주세요.','친구가 많으면 든든하지만 외교는 단체 채팅방이 아니죠. 읽었다는 표시 말고 약속을 지켰다는 표시가 필요합니다.'],
 technology:['새 기술을 배우는 데 찬성합니다. 우리 회사 컴퓨터는 켜지는 동안 점심을 먹어도 되니, 이제 세대교체 좀 해야죠.','기계는 업데이트 버튼 한 번인데 사람은 생계가 걸립니다. 효율 좋아졌다는 발표 옆에 재취업 버튼도 만들어 주세요.','디지털 전환이라면서 신청은 종이 열 장이네요. 미래로 가는 길에 팩스가 통행료를 받고 있는 건 아니겠죠?'],
 welfare:['살림에 숨통이 트이면 좋겠습니다. 우리 집 가계부는 매달 공포소설인데, 이번에는 결말 장르를 좀 바꿔 보고 싶네요.','꼭 필요한 사람에게 지원이 가야죠. 신청 화면에서 길을 잃어 지원금 대신 인내심만 받는 일은 없어야 합니다.','서로 누가 더 힘드냐고 겨루면 우승 상품도 한숨뿐이에요. 지원의 문턱부터 낮추고 손 내밀 사람을 찾읍시다.'],
 energy:['전기와 도로는 미리 손봐야 합니다. 불이 꺼진 뒤 촛불 아래서 미래 비전을 발표하면 분위기만 좋아질 테니까요.','준공식 리본은 잘 잘라 놓고 유지비는 누가 내나요? 새 시설이 사진 촬영 끝나자마자 은퇴하지는 않았으면 합니다.','계획도에서는 모든 길이 뻥 뚫려 있더군요. 현실의 출근길에도 그 지도 제작자의 낙관을 조금 나눠 주세요.'],
 food:['물과 식량부터 챙깁시다. 밥상은 거창한 발표를 소화하지 못하니, 실제로 먹고 마실 것이 도착해야 하거든요.','비축 창고보다 서류 보관함이 먼저 가득 찰까 걱정입니다. 유통기한은 기다려 주지 않으니 현장 속도로 움직여 주세요.','나누자는 말은 좋은데 줄 서는 규칙도 공평해야죠. 특별 통로가 너무 많으면 결국 일반 통로만 길어집니다.']
};

// Negotiation and crisis state is persisted alongside the original room rules.
export type PrivateIntel={id:string;nation:number;round:number;title:string;text:string;shared:number[]};
export type PandemicArc={phase:number;status:'active'|'contained'|'failed';startedRound:number;phaseRound:number;responses:{nation:number;kind:string;phase:number}[]};
export type PublicPledge={kind:'peace'|'response';round:number;due:number;status:'active'|'kept'|'broken'};
export const CRISIS_PHASES=['감염 확산','의료 과부하','공급망 붕괴'];
export const CRISIS_RESPONSES=[
 {id:'care',name:'의료 인력·병상 지원',track:'relief',cost:22,effect:{infrastructure:7,support:6},description:'구호 확보 · 의료 기반과 국민 신뢰 개선'},
 {id:'supplies',name:'방역 물자·운송 지원',track:'relief',cost:20,effect:{infrastructure:5,economy:5},description:'구호 확보 · 공급망과 경제 회복 지원'},
 {id:'research',name:'치료제 공동 연구',track:'research',cost:24,effect:{infrastructure:7,relations:6},description:'연구 확보 · 기술 기반과 국제 신뢰 개선'},
 {id:'share',name:'감염 자료·검증 공개',track:'research',cost:18,effect:{relations:7,support:4},description:'연구 확보 · 정보 공유와 국민 신뢰 개선'}
];
export function responseCost(nation:number,kind:string){const x=CRISIS_RESPONSES.find(x=>x.id===kind);return x?x.cost-(['care','research','supplies','share'][nation]===kind?6:0):Infinity;}
export function crisisReadiness(arc:PandemicArc){const responses=arc.responses.filter(x=>x.phase===arc.phase);const nations=new Set(responses.map(x=>x.nation)).size;return {nations,relief:responses.some(x=>CRISIS_RESPONSES.find(y=>y.id===x.kind)?.track==='relief'),research:responses.some(x=>CRISIS_RESPONSES.find(y=>y.id===x.kind)?.track==='research')};}
export const DEAL_ITEMS=[
 {id:'funding',name:'긴급 예산',cost:18,effect:{money:18},detail:'상대에게 중간 규모 예산 이전'},
 {id:'medical',name:'의료 지원',cost:16,effect:{infrastructure:7,support:3},detail:'의료 기반 개선 · 이후 팬데믹 피해 완화'},
 {id:'materials',name:'산업·물자 지원',cost:16,effect:{economy:6,infrastructure:5},detail:'경제와 인프라 소폭 개선'},
 {id:'research',name:'기술 지원',cost:18,effect:{infrastructure:8,relations:3},detail:'기술 기반과 국제 관계 개선'},
 {id:'peace',name:'상호 불가침 약속',cost:0,effect:{},detail:'다음 턴 종료까지 양국 모두 전쟁·제재·최후통첩 금지'}
];
export type Deal={id:string;from:number;to:number;give:string;ask:string;round:number;created:number;expires:number;due:number;status:'pending'|'active'|'completed'|'rejected'|'expired'|'broken';escrow:number;counterOf?:string;brokenBy?:number};
export const OBJECTIVES=[
 {title:'힘을 갖춘 협상가',text:'방위 행동 또는 국방 정책을 시행하고, 조건부 거래를 한 번 끝까지 이행한다.'},
 {title:'거래의 연결점',text:'분야별 공개 협정을 맺고, 조건부 거래를 한 번 끝까지 이행한다.'},
 {title:'우리 손으로 세운 기반',text:'국내 인프라 투자를 완료하고, 위기 공동 대응에 한 번 참여한다.'},
 {title:'정보에서 신뢰로',text:'비밀 보고서를 다른 나라에 공유하고, 조건부 거래를 한 번 끝까지 이행한다.'}
];
function createIntel(r:Room){
 const active=r.arc?.status==='active',phase=r.arc?.phase||1;
 const leads=[
  '군 의료 인력을 민간 병상으로 돌릴 수 있습니다. 우리나라는 의료 지원 예산 부담이 낮지만 치료제 연구에는 이웃의 협력이 필요합니다.',
  '치료제 연구망이 연결되어 있습니다. 우리나라는 공동 연구 예산 부담이 낮지만 생산·운송을 맡을 나라가 필요합니다.',
  '물자 생산과 운송망을 전환할 수 있습니다. 우리나라는 방역 물자 지원 예산 부담이 낮으며 연구 정보를 가진 나라와 협상할 여지가 있습니다.',
  '현지 감염 보고를 교차 검증할 수 있습니다. 우리나라는 감염 자료 공개 예산 부담이 낮지만 현장 의료 지원은 다른 나라와 나눠야 합니다.'
 ];
 r.intel=r.players.map(p=>({id:crypto.randomUUID(),nation:p.nation,round:r.round,shared:[],title:active?`${CRISIS_PHASES[phase-1]} · 우리 정보기관 보고`:'국가별 협상 보고',text:`${leads[p.nation]} ${active?(phase===1?'현재 대응을 놓치면 다음 턴 병상 부족으로 번집니다.':phase===2?'이번에도 공조가 실패하면 공급망까지 흔들립니다.':'마지막 대응 기회입니다. 구호와 연구를 함께 완료해야 합니다.'):'국제 협상에서 먼저 정보를 공개할지, 조건을 제시할지 결정하세요.'}`}));
}
function advanceCrisis(r:Room,final=false){const a=r.arc;if(!a||a.status!=='active')return;
 const ready=crisisReadiness(a),before=incidentSnapshot(r);
 if(ready.nations>=2&&ready.relief&&ready.research){a.status='contained';for(const p of r.players)effect(p,{support:7,economy:5});r.tension=clamp(r.tension-8);publishExtra(r,'공동 대응으로 팬데믹 억제',[{tag:'위기의 전환',headline:'물자와 연구가 만났다, 위기는 꺾였다!',body:'서로 다른 나라가 대응을 나눠 맡자 확산세가 잦아들었다. 악수 사진보다 현장의 협력이 먼저 도착했다.',image:0}]);log(r,'구호·연구 공동 대응으로 팬데믹 악화를 막았습니다. 국민 신뢰와 경제가 회복됩니다.');return;}
 for(const p of r.players){const participating=a.responses.some(x=>x.phase===a.phase&&x.nation===p.nation);const protection=participating?.55:1;effect(p,{economy:-Math.round(4*a.phase*protection),support:-Math.round(3*a.phase*protection)});const readiness=Math.max(.35,1-(p.prepared?.health||0)/100);addLosses(p,'장기 팬데믹',Math.round(NATIONAL_POPULATIONS[p.nation]/100000*14*a.phase*protection*readiness),employmentScale(p,18*a.phase*protection));}
 if(a.phase>=3||final){a.status='failed';publishExtra(r,'국제 공조 실패',[{tag:'위기 결산',headline:'닫힌 국경, 늦어진 회복',body:'구호와 연구가 끝내 만나지 못했다. 남은 피해와 복구 부담은 시민들에게 돌아갔다.',image:0}]);}
 else{a.phase++;a.phaseRound=r.round;publishExtra(r,'팬데믹 위기 심화',[{tag:'연쇄 위기',headline:CRISIS_PHASES[a.phase-1],body:a.phase===2?'병상 부족이 일상을 밀어낸다. 구호와 연구, 서로 다른 나라의 역할 분담이 시급하다.':'항구와 일터까지 멈춘다. 이번에도 협력이 늦으면 위기를 억제할 마지막 기회를 잃는다.',image:0}]);}
 recordIncident(r,'crisis',a.status==='failed'?'팬데믹 공조 실패':`팬데믹 · ${CRISIS_PHASES[a.phase-1]}`,r.players.map(p=>p.nation),before);
}
function resolveCrisisResponse(r:Room,j:Job){const p=byNation(r,j.actor),x=CRISIS_RESPONSES.find(x=>x.id===j.topic)!;const before=snapshot(r);effect(p,x.effect);p.prepared??={};p.prepared.health=Math.min(65,(p.prepared.health||0)+12);p.history.crisisHelp=(p.history.crisisHelp||0)+1;
 if(r.arc?.status==='active'&&!r.arc.responses.some(y=>y.nation===p.nation&&y.phase===j.choice))r.arc.responses.push({nation:p.nation,kind:x.id,phase:j.choice!});
 log(r,`${short(p.nation)}의 ${x.name} 완료. ${j.choice===r.arc?.phase?'공동 대응에 반영됩니다.':'예정했던 단계는 지났지만 자국 의료 대비가 강화됐습니다.'}`,p.nation,'crisis-response');recordChanges(r,before,x.name);checkObjective(r,p);
}
function deliverItem(r:Room,from:number,to:number,item:string){const x=DEAL_ITEMS.find(x=>x.id===item)!;const before=snapshot(r);effect(byNation(r,to),x.effect);recordChanges(r,before,'거래 지원 도착');if(item==='medical'){const p=byNation(r,to);p.prepared??={};p.prepared.health=Math.min(65,(p.prepared.health||0)+16);}log(r,`${short(from)} → ${short(to)}: ${x.name} 전달.`,from,'deal');}
function finishDeal(r:Room,d:Deal){d.status='completed';for(const n of [d.from,d.to]){const p=byNation(r,n);effect(p,{relations:5,support:2});p.history.dealsKept=(p.history.dealsKept||0)+1;checkObjective(r,p);}changeRelation(r,d.from,d.to,20,'조건부 거래 이행');dispatch(r,d.to,d.from,'deal','거래 약속 이행','양국의 약속이 이행되어 신뢰가 높아졌습니다.');publishExtra(r,'거래 약속 이행',[{tag:'외교 합의',headline:`${short(d.from)}·${short(d.to)}, 약속을 지켰다`,body:'지원 뒤에 돌아온 것은 핑계가 아닌 이행이었다. 다음 협상에도 문이 열릴까?',image:4}]);}
function breakDeal(r:Room,d:Deal,actor:number){if(d.status!=='active')return;d.status='broken';d.brokenBy=actor;effect(byNation(r,actor),{relations:-12,support:-4});changeRelation(r,d.from,d.to,-30,'거래 약속 파기');publishExtra(r,'국가 간 약속 파기',[{tag:'외교 파문',headline:`${short(actor)}, 약속을 저버렸다`,body:'먼저 받은 지원 뒤에 이행은 없었다. 상대국 시민들이 다음 거래의 조건부터 다시 따지고 있다.',image:5}]);dispatch(r,actor,actor===d.from?d.to:d.from,'deal','거래 약속 파기','상대의 약속 파기로 관계가 악화됐습니다.');log(r,`${short(actor)}의 조건부 거래 약속 파기. 신뢰와 국내 지지가 하락합니다.`,actor,'deal');}
function settleDeals(r:Room){for(const d of r.deals||[]){if(d.status==='pending'&&r.clock>=d.expires){byNation(r,d.from).money+=d.escrow;d.escrow=0;d.status='expired';}else if(d.status==='active'&&r.clock>=d.due){if(d.ask==='peace')finishDeal(r,d);else breakDeal(r,d,d.to);}}}
function breakPeace(r:Room,p:Player,target:number){for(const d of r.deals||[])if(d.status==='active'&&d.ask==='peace'&&[d.from,d.to].includes(p.nation)&&[d.from,d.to].includes(target))breakDeal(r,d,p.nation);if(p.pledge?.status==='active'&&p.pledge.kind==='peace'){p.pledge.status='broken';effect(p,{relations:-8,support:-4});log(r,`${short(p.nation)}이 공개한 비공격 약속을 어겼습니다.`,p.nation,'pledge');}}
function settlePledges(r:Room){for(const p of r.players){const v=p.pledge;if(!v||v.status!=='active'||r.clock<v.due)continue;const kept=v.kind==='peace'||(r.arc?.responses||[]).some(x=>x.nation===p.nation&&x.phase===p.history.pledgedPhase);v.status=kept?'kept':'broken';effect(p,kept?{relations:4,support:3}:{relations:-6,support:-4});log(r,`${short(p.nation)}의 공개 약속 ${kept?'이행':'불이행'}.`,p.nation,'pledge');}}
function checkObjective(r:Room,p:Player){if(!r.strategyVersion||p.objectiveDone)return;const h=p.history;const done=[!!h.defensePolicy||!!h.mobilize,!!h.treatyAccepted,!!h.infrastructure,!!h.sharedIntel][p.nation]&&(p.nation===2?!!h.crisisHelp:!!h.dealsKept);if(done){p.objectiveDone=true;effect(p,{support:5,[NATIONS[p.nation].goal]:6});log(r,`${short(p.nation)}이 비밀 국가 목표 「${OBJECTIVES[p.nation].title}」를 달성했습니다.`,p.nation,'objective');voice(r,p.nation,'목표 달성 발표가 왔네요. 이번에는 현수막만 출근한 게 아니라 성과도 같이 출근해서 반갑습니다.',false);}}
function rememberPolicy(r:Room,p:Player,c:Choice){if(!r.strategyVersion)return;if(['defend','patrol'].includes(c.id||''))p.history.defensePolicy=1;
 const last=p.memory;const text=last?`지난번 「${last.policy}」도 기억하고 있습니다. 이번 「${c.label}」까지 이어지니 정부의 다음 장면이 보이네요. 예고편만 재미있고 본편은 기다리라는 결말은 사양합니다.`:`「${c.label}」, 기억해 두겠습니다. 발표는 금방 지나가도 우리 가게 장부는 매일 출근하거든요. 다음 정책 때도 같이 살펴볼게요.`;
 voice(r,p.nation,text,false,[p.nation],CITIZENS[[2,4,15,12][p.nation]]);p.memory={policy:c.label,round:r.round};}
function strategyCommand(r:Room,p:Player,c:Command,now:number){
 assert(r.status==='playing','진행 중인 게임이 아닙니다.');assert(r.strategyVersion,'새 기능은 새로 시작한 방에서 사용할 수 있습니다.');
 if(c.type==='crisis_response'){assert(p.choice!==null,'이번 턴의 정책을 먼저 선택해 주세요.');assert(r.arc?.status==='active','현재 진행 중인 팬데믹 위기가 없습니다.');const x=CRISIS_RESPONSES.find(x=>x.id===c.response);assert(x,'대응 종류를 선택해 주세요.');assert(!r.arc.responses.some(x=>x.nation===p.nation&&x.phase===r.arc!.phase)&&!r.jobs.some(j=>j.actor===p.nation&&j.action==='crisis-response'),'이 단계의 대응은 이미 준비 중이거나 완료했습니다.');assert(now+18000<=r.deadline,'이 단계가 끝나기 전 완료할 시간이 부족합니다.');assert(r.jobs.filter(j=>j.actor===p.nation&&j.action!=='policy').length<4,'진행 중인 행동을 먼저 완료해 주세요.');const cost=responseCost(p.nation,x.id);assert(p.money>=cost,'공동 대응 예산이 부족합니다.');p.money-=cost;r.jobs.push({id:crypto.randomUUID(),actor:p.nation,target:-1,action:'crisis-response',topic:x.id,choice:r.arc.phase,start:now,end:now+18000,text:''});return;}
 if(c.type==='share_intel'){const info=r.intel?.find(x=>x.nation===p.nation&&x.round===r.round);assert(info,'현재 보고서가 없습니다.');const recipients=r.players.filter(x=>x.nation!==p.nation&&(c.target===-1||x.nation===c.target));assert(recipients.length,'정보를 공유할 국가를 선택해 주세요.');assert(recipients.some(x=>!info.shared.includes(x.nation)),'이미 공유한 보고서입니다.');for(const x of recipients)if(!info.shared.includes(x.nation)){dispatch(r,p.nation,x.nation,'intel',info.title,info.text);info.shared.push(x.nation);}p.history.sharedIntel=1;checkObjective(r,p);return;}
 if(c.type==='pledge'){assert(p.choice!==null,'이번 턴의 정책을 먼저 선택해 주세요.');assert(!p.pledge,'공개 약속은 한 게임에 한 번만 선언할 수 있습니다.');assert(['peace','response'].includes(c.pledge||''),'약속 종류를 선택해 주세요.');assert(now<r.deadline-r.duration*500,'약속은 턴의 전반부에 선언해 주세요.');if(c.pledge==='response'){assert(r.arc?.status==='active','진행 중인 위기가 없습니다.');assert(!r.arc.responses.some(x=>x.phase===r.arc!.phase&&x.nation===p.nation),'이미 완료한 대응은 약속할 수 없습니다.');p.history.pledgedPhase=r.arc.phase;}p.pledge={kind:c.pledge as PublicPledge['kind'],round:r.round,due:r.deadline,status:'active'};log(r,`${short(p.nation)}의 공개 약속: ${c.pledge==='peace'?'이번 턴 강압 행동을 시작하지 않겠다':'이번 단계의 공동 대응을 완료하겠다'}.`,p.nation,'pledge');return;}
 if(c.type==='deal_propose'){
 assert(p.choice!==null,'이번 턴의 정책을 먼저 선택해 주세요.');const t=r.players.find(x=>x.nation===c.target&&x.nation!==p.nation);assert(t,'대상 국가를 선택해 주세요.');const give=DEAL_ITEMS.find(x=>x.id===c.give&&x.id!=='peace'),ask=DEAL_ITEMS.find(x=>x.id===c.ask);assert(give&&ask&&give.id!==ask.id,'서로 다른 지원과 대가를 선택해 주세요.');const counter=c.dealId?r.deals!.find(x=>x.id===c.dealId&&x.to===p.nation&&x.from===t.nation&&x.status==='pending'):undefined;assert(!c.dealId||counter,'수정할 제안이 만료됐습니다.');assert(r.deals!.filter(d=>d.from===p.nation&&['pending','active'].includes(d.status)).length<2,'진행 중인 거래는 두 건까지 제안할 수 있습니다.');assert(!r.deals!.some(d=>d.from===p.nation&&d.to===t.nation&&d.round===r.round&&!['rejected','expired'].includes(d.status)),'이번 턴에 이 국가에 제안한 거래가 있습니다.');assert(p.money>=give.cost,'선지원 예산이 부족합니다.');assert(now+15000<r.deadline+(10-r.round)*r.duration*1000,'협상할 시간이 부족합니다.');
 if(counter){counter.status='rejected';byNation(r,counter.from).money+=counter.escrow;counter.escrow=0;}
 p.money-=give.cost;const expires=Math.min(r.deadline+r.duration*1000,r.deadline+(10-r.round)*r.duration*1000);const d:Deal={id:crypto.randomUUID(),from:p.nation,to:t.nation,give:give.id,ask:ask.id,created:now,round:r.round,expires,due:0,status:'pending',escrow:give.cost,counterOf:counter?.id};r.deals!.push(d);dispatch(r,p.nation,t.nation,'deal',counter?'거래 수정안 도착':'조건부 거래 제안',`${give.name}을 지금 제공하고 ${ask.name}을 약속받고 싶습니다. 협상 탭에서 결정하세요.`);return;
 }
 const d=r.deals!.find(x=>x.id===c.dealId);assert(d,'거래를 찾을 수 없습니다.');
 if(c.type==='deal_respond'){assert(d.to===p.nation&&d.status==='pending','응답 가능한 거래가 없습니다.');assert(typeof c.accept==='boolean','수락 또는 거절을 선택해 주세요.');if(!c.accept){d.status='rejected';byNation(r,d.from).money+=d.escrow;d.escrow=0;dispatch(r,p.nation,d.from,'deal','거래 거절','상대가 조건부 거래를 거절했습니다. 선지원 예산은 반환되었습니다.');return;}d.status='active';d.due=Math.min(r.deadline+r.duration*1000,r.deadline+(10-r.round)*r.duration*1000);d.escrow=0;deliverItem(r,d.from,d.to,d.give);dispatch(r,p.nation,d.from,'deal','거래 수락','선지원이 전달되었습니다. 상대의 약속 이행을 기다립니다.');log(r,`${short(d.from)}·${short(d.to)} 조건부 거래 수락. ${DEAL_ITEMS.find(x=>x.id===d.ask)!.name} 이행 약속.`,p.nation,'deal');return;}
 assert(d.status==='active'&&(d.to===p.nation||d.ask==='peace'&&d.from===p.nation),'본인이 이행할 거래가 아닙니다.');
 if(c.type==='deal_break'){breakDeal(r,d,p.nation);return;}
 assert(d.ask!=='peace','불가침 약속은 기한까지 지켜야 완료됩니다.');const item=DEAL_ITEMS.find(x=>x.id===d.ask)!;assert(p.money>=item.cost,'약속을 이행할 예산이 부족합니다.');p.money-=item.cost;deliverItem(r,d.to,d.from,d.ask);finishDeal(r,d);
}
function runStrategyAI(r:Room,p:Player){if(!r.strategyVersion)return;
 for(const d of r.deals||[]){if(d.to!==p.nation)continue;
 if(d.status==='active'&&d.ask!=='peace'){const cost=DEAL_ITEMS.find(x=>x.id===d.ask)!.cost;if(p.money>=cost)strategyCommand(r,p,{type:'deal_fulfill',dealId:d.id},r.clock);}
 if(d.status==='pending'){const benefit=DEAL_ITEMS.find(x=>x.id===d.give)!,owed=DEAL_ITEMS.find(x=>x.id===d.ask)!;const value=aiValue(r,p,benefit.effect)+aiValue(r,p,{relations:5,support:2})-owed.cost*aiMoneyValue(r);strategyCommand(r,p,{type:'deal_respond',dealId:d.id,accept:value>0&&p.money+Math.max(0,benefit.effect.money||0)>=owed.cost},r.clock);}}
 // Select policies before starting new actions; a following AI tick can respond.
 if(p.choice===null)return;
 if(r.arc?.status==='active'&&!r.arc.responses.some(x=>x.nation===p.nation&&x.phase===r.arc!.phase)&&!r.jobs.some(j=>j.actor===p.nation&&j.action==='crisis-response')&&r.clock+18000<=r.deadline&&r.jobs.filter(j=>j.actor===p.nation&&j.action!=='policy').length<4){const ready=crisisReadiness(r.arc);const partners=r.players.map(x=>x.nation).sort((a,b)=>a-b),index=partners.indexOf(p.nation);const track=ready.relief&&!ready.research?'research':ready.research&&!ready.relief?'relief':index%2?'research':'relief';const options=CRISIS_RESPONSES.filter(x=>x.track===track).sort((a,b)=>(aiValue(r,p,b.effect)-responseCost(p.nation,b.id)*aiMoneyValue(r))-(aiValue(r,p,a.effect)-responseCost(p.nation,a.id)*aiMoneyValue(r)));const x=options.find(x=>p.money>=responseCost(p.nation,x.id));if(x)strategyCommand(r,p,{type:'crisis_response',response:x.id},r.clock);}
 if(!(p.history[`strategyRound:${r.round}`])&&r.clock<r.deadline-20000){p.history[`strategyRound:${r.round}`]=1;const target=r.players.find(x=>x.nation!==p.nation);if(target){strategyCommand(r,p,{type:'share_intel',target:target.nation},r.clock);const give=p.nation===1?'funding':p.nation===2?'materials':'medical';if(p.money>=DEAL_ITEMS.find(x=>x.id===give)!.cost+20&&r.deals!.filter(d=>d.from===p.nation&&['pending','active'].includes(d.status)).length<2&&!r.deals!.some(d=>d.from===p.nation&&d.to===target.nation&&d.round===r.round&&!['rejected','expired'].includes(d.status))){strategyCommand(r,p,{type:'deal_propose',target:target.nation,give,ask:'peace'},r.clock);}}}
}
