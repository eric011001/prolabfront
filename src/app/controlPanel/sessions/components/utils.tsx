import axios from "axios";

interface DynamicHeader {
  [key: string]: string;
}

type Session = {
  questions: Array<string>;
  title: string;
  createdBy?: string;
  createdAt?: Date;
  status?: string;
};
type Cord = {
  x: number;
  y: number;
}

type ExtraPossibleAnswerData = {
  cords: Array<Cord> | null;
  result: string | null;
  isCorrect: boolean | null;
}

type PossibleAnswer = {
  title: string;
  points: number;
  extraData: ExtraPossibleAnswerData;
}

type QuestionInterface = {
  title: string;
  description: string;
  type: string;
  possibleAnswers: Array<PossibleAnswer>;
}
export class SessionApi {
  server: string;
  nameSpace: string;

  constructor(nameSpace: string) {
    this.server = `${process.env.server_host}${process.env.server_port}/`;
    this.nameSpace = nameSpace;
  }

  get url() {
    return `${this.server}${this.nameSpace}`;
  }

  getconfig(extraHeaders: DynamicHeader) {
    const token = localStorage.getItem("token");
    return { headers: { ...extraHeaders, Authorization: `Bearer ${token}` } };
  }

  async getUserSessions() {
    return await axios.get(`${this.url}/get-user-sessions`, this.getconfig({})).then(({data}) => data.object);
  }

  async createSession(params: Session) {
    return await axios
    .post(`${this.url}/create`, params, this.getconfig({}))
    .then(({ data }) => data.object);
  }

  async getSessionInfo(params: string | string[]) {
    return await axios.get(`${this.url}/${params}`,this.getconfig({})).then(({ data }) => data.object);
  }
  async editSession(params: {title: string, questions?: Array<string>}, id: string | string []) {
    return await axios.post(`${this.url}/edit/${id}`, {session: params}, this.getconfig({})).then(({ data }) => data.object);
  }
}

export class QuestionApi {
  server: string;
  nameSpace: string;

  constructor(nameSpace: string) {
    this.server = `${process.env.server_host}${process.env.server_port}/`;
    this.nameSpace = nameSpace;
  }

  get url() {
    return `${this.server}${this.nameSpace}`;
  }

  getconfig(extraHeaders: DynamicHeader) {
    const token = localStorage.getItem("token");
    return { headers: { ...extraHeaders, Authorization: `Bearer ${token}` } };
  }
  async getSessionQuestions(param:string | string[]){
    return await axios.get(`${this.url}/get-session-questions/${param}`, this.getconfig({})).then(({ data }) => data.object);
  }
  async saveQuestion(question: QuestionInterface, session: string | string[]) {
    return await axios.post(`${this.url}/create`, {question, session}, this.getconfig({})).then(({ data }) => data.object);
  }
  async editQuestion(question: QuestionInterface, questionId: string) {
    return await axios.post(`${this.url}/edit/${questionId}`, {question}, this.getconfig({})).then(({ data }) => data.object);
  }
}
