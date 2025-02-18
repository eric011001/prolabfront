import axios from "axios";
import { NodeId } from "react-accessible-treeview";

interface DynamicHeader {
  [key: string]: string;
}

type Document = {
  content: string;
  title: string;
  parent: string;
  isRoot: boolean;
};

export class DocsApi {
  server: string;
  nameSpace: string;

  constructor(nameSpace: string) {
    this.server = `${process.env.server_host}${process.env.server_port}/`
    this.nameSpace = nameSpace;
  }

  get url() {
    return `${this.server}${this.nameSpace}`;
  }

  getconfig(extraHeaders: DynamicHeader) {
    const token = localStorage.getItem("token");
    return { headers: { ...extraHeaders, Authorization: `Bearer ${token}` } };
  }

  async getTreeView() {
    return await axios
      .get(`${this.url}/tree-view`, this.getconfig({}))
      .then(({ data }) => data.object);
  }
  async createNode(parent: string | NodeId) {
    const node = {
      content: "Contenido",
      title: "hijo de nodo Raiz",
      parent,
      isRoot: false,
    };
    return await axios
      .post(`${this.url}/create`, node, this.getconfig({}))
      .then(({ data }) => data.object);
  }

  async getNode(id: string | NodeId) {
    return await axios
      .get(`${this.url}/node/${id}`, this.getconfig({}))
      .then(({ data }) => data.object);
  }

  async deleteNode(id: string | NodeId) {
    return await axios
      .post(`${this.url}/delete/${id}`, {}, this.getconfig({}))
      .then(({ data }) => data.object);
  }

  async editNode(id: string | NodeId, node: Partial<Document> | null) {
    return await axios
      .post(`${this.url}/edit/${id}`, node, this.getconfig({}))
      .then(({ data }) => data.object);
  }
}
