"use client";
import "flowbite";
import React, { useEffect, useState, useRef } from "react";
import Menu from "../components/Menu";
import ConfirmModal from "../components/ConfirmModal";
import "@mdxeditor/editor/style.css";
import {
  MDXEditor,
  toolbarPlugin,
  linkDialogPlugin,
  linkPlugin,
  codeBlockPlugin,
  listsPlugin,
  headingsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  KitchenSinkToolbar,
  tablePlugin,
  imagePlugin,
  frontmatterPlugin,
  codeMirrorPlugin,
  directivesPlugin,
  diffSourcePlugin,
} from "@mdxeditor/editor";

import TreeView, { flattenTree, NodeId } from "react-accessible-treeview";

import { DocsApi } from "./components/utils";
import Arrow from "./components/Arrow";

type Node = {
  id: NodeId;
  name: string;
  title: string;
};

type Doc = {
  id: string | NodeId;
  content: string;
  title: string;
  parent: string;
  isRoot: boolean;
  writtenBy: string;
};

export default function Home() {
  const modalRef = useRef();
  const docsApi = new DocsApi("docs");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDoc, setLoadingDoc] = useState<boolean>(false);
  const [selectedDoc, setSelectedDoc] = useState<Doc | Node | null>(null);
  const [savingDoc, setSavingDoc] = useState<boolean>(false);
  const [deletedDoc, setDeletedDoc] = useState<NodeId | null>(null);
  const [treeInfo, setTreeInfo] = useState< unknown | null>(
    flattenTree({
      name: "",
      children: [],
    })
  );
  useEffect(() => {
    const loadPermissions = async () => {
      try {
        setLoading(true);
        const data = await docsApi.getTreeView();
        const formattedData = flattenTree({
          name: "",
          children: [data],
        });
        setTreeInfo(formattedData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    loadPermissions();
  }, []);

  const reloadData = async () => {
    try {
      setLoading(true);
      const data = await docsApi.getTreeView();
      const formattedData = flattenTree({
        name: "",
        children: [data],
      });
      setTreeInfo(formattedData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteNode = async () => {
    await docsApi.deleteNode(deletedDoc ?? "");
    setSelectedDoc(null);
    await reloadData();
  };

  const addNewNode = async (id: NodeId) => {
    await docsApi.createNode(id);
    await reloadData();
  };

  const changeSelectedDoc = (data: Node) => {
    setSelectedDoc(data);
  };

  const editData = async (id: NodeId) => {
    try {
      setSavingDoc(true);
      await docsApi.editNode(id, selectedDoc);
      await reloadData();
    } catch (error) {
      console.log(error);
    } finally {
      setSavingDoc(false);
    }
  };

  const selectNode = async (id: NodeId) => {
    try {
      setLoadingDoc(true);
      const result = await docsApi.getNode(id);
      console.log(result);
      setSelectedDoc(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingDoc(false);
    }
  };

  const showDeleteModal = (id: NodeId) => {
    setDeletedDoc(id);
    modalRef.current.showModal();
  };

  return (
    <Menu>
      <div className="p-4 border-gray-200 rounded-lg dark:border-gray-700 mt-14 border-2 border h-screen overflow-y-auto">
        <div className="flex">
          <div className="w-1/3 h-full">
            <div className="">
              <h3 className="text-center font-bold text-xl mb-3">
                Documentación
              </h3>
            </div>
            {loading || !treeInfo ? (
              <div className="flex items-center">
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="w-4 h-4 me-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
                Cargando documentos
              </div>
            ) : (
              <TreeView
                data={treeInfo}
                className="basic"
                aria-label="basic example tree"
                nodeRenderer={({
                  element,
                  getNodeProps,
                  level,
                  isBranch,
                  isExpanded,
                }) => (
                  <div
                    {...getNodeProps()}
                    style={{ paddingLeft: 20 * (level - 1) }}
                    className="flex p-2"
                  >
                    {isBranch ? (
                      <>
                        <Arrow isExpanded={isExpanded} />
                      </>
                    ) : null}
                    {element.name}
                    <button
                      className="mx-2"
                      onClick={() => addNewNode(element.id)}
                    >
                      <svg
                        className="w-4 h-4 text-gray-800 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                    </button>
                    <button
                      className="mr-2"
                      onClick={() => selectNode(element.id)}
                    >
                      <svg
                        className="w-4 h-4 text-gray-800 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28"
                        />
                      </svg>
                    </button>
                    {element.children.length === 0 ? (
                      <button onClick={() => showDeleteModal(element.id)}>
                        <svg
                          className="w-4 h-4 text-gray-800 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                          />
                        </svg>
                      </button>
                    ) : null}
                  </div>
                )}
              />
            )}
          </div>
          <div className="w-2/3 h-screen">
            {!selectedDoc || loadingDoc ? (
              <div className="h-screen flex w-full py-6 justify-center">
                <div className="text-center w-full">
                  <div className=" w-full flex justify-center">
                    <svg
                      className="w-36 h-36 mt-12 text-gray-800 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 12v1h4v-1m4 7H6a1 1 0 0 1-1-1V9h14v9a1 1 0 0 1-1 1ZM4 5h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                      />
                    </svg>
                  </div>

                  <h3 className="font-bold text-2xl">Documento</h3>
                  {
                    loadingDoc ?
                    (
                      <p>Descargando documento, espere por favor</p>
                    ) :
                    (
                      <p>Selecciona un documento para comenzar a editar</p>
                    )
                  }
                </div>
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <label
                    htmlFor="title"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Titulo
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Titulo"
                    required
                    value={selectedDoc.title ?? ""}
                    onChange={({ target: { value } }) =>
                      changeSelectedDoc({
                        ...selectedDoc, title: value,
                        name: ""
                      })
                    }
                  />
                </div>
                <MDXEditor
                  markdown={selectedDoc.content}
                  onChange={(e) =>
                    changeSelectedDoc({ ...selectedDoc, content: e })
                  }
                  contentEditableClassName="prose"
                  plugins={[
                    toolbarPlugin({
                      toolbarContents: () => <KitchenSinkToolbar />,
                    }),
                    listsPlugin(),
                    quotePlugin(),
                    headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
                    linkPlugin(),
                    linkDialogPlugin(),
                    imagePlugin({
                      imageAutocompleteSuggestions: [
                        "https://via.placeholder.com/150",
                        "https://via.placeholder.com/150",
                      ],
                    }),
                    tablePlugin(),
                    thematicBreakPlugin(),
                    frontmatterPlugin(),
                    codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
                    codeMirrorPlugin({
                      codeBlockLanguages: {
                        js: "JavaScript",
                        css: "CSS",
                        txt: "text",
                        tsx: "TypeScript",
                      },
                    }),
                    directivesPlugin({
                      directiveDescriptors: [],
                    }),
                    diffSourcePlugin({
                      viewMode: "rich-text",
                      diffMarkdown: "boo",
                    }),
                    markdownShortcutPlugin(),
                  ]}
                />
                <div className="flex justify-between">
                  <div>
                    Creado por: {selectedDoc.writtenBy}
                  </div>
                  <button
                    type="button"
                    disabled={savingDoc}
                    className="focus:outline-none text-white font-bold text-lg bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
                    onClick={() => editData(selectedDoc.id)}
                  >
                    Guardar cambios
                  </button>
                </div>
              </>
            )}
          </div>
          <ConfirmModal
            title="¿Seguro que deseas eliminar este registro?"
            ref={modalRef}
            id={"deleteModal"}
            confirmButton={"Si, seguro"}
            dimissButton={"Cancelar"}
            comfirmButtonColor={"bg-red-700 hover:bg-red-800"}
            dimissButtonColor={""}
            confirmButtonAction={() => deleteNode()}
          />
        </div>
      </div>
    </Menu>
  );
}
