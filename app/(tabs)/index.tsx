import { FlatList, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { PostCard } from '@/components/PostCard';
import { usePostagemData } from '@/hooks/postagem/usePostagemData';
import PostagemProps from '../interface/PostagemProps';

export default function HomeScreen() {
  // const { data: postagens, isPending, isError, error } = usePostagemData();

  // if (isPending) {
  //   return (
  //     <View style={styles.container}>
  //       <ActivityIndicator size="large" />
  //       <Text>Carregando postagens...</Text>
  //     </View>
  //   );
  // }

  // if (isError) {
  //   return (
  //     <View style={styles.container}>
  //       <Text>Erro ao carregar postagens.</Text>
  //       <Text>{error.message}</Text>
  //     </View>
  //   );
  // }

  const postagens : PostagemProps[] = [
  {
    "id": "85b90e74-f89b-48eb-8a3b-f541e2694649",
    "descricao": "E aí gente, criei um grupo aqui que o pessoal tá mandando dicas de campeonato:\nlink.do.grupo.com/chat",
    "scramble": null,
    "usuario": {
      "email": "lucasmilhao@gmail.com",
      "id": "1731b9a0-5e09-4357-a4e6-71207c148f93",
      "isGuest": false,
      "nome": "luquinhasadm",
      "picture": "https://res.cloudinary.com/t8awtqrh/image/upload/v1792962271/cubing2gether/hoavhwatapadzpdgfgup.jpg",
      "tipo": "ADMIN",
      "username": "luquinhasadm"
    },
    "createdAt": "2026-10-26T17:54:51.068541Z",
    "curtidas": 2,
    "comentarios": [
      {
        "id": "3dac29ac-1c8e-4589-9030-bd82a5ccdd97",
        "usuario": {
          "email": "lucasmilhao@gmail.com",
          "id": "1731b9a0-5e09-4357-a4e6-71207c148f93",
          "isGuest": false,
          "nome": "luquinhasadm",
          "picture": "https://res.cloudinary.com/t8awtqrh/image/upload/v1792962271/cubing2gether/hoavhwatapadzpdgfgup.jpg",
          "tipo": "ADMIN",
          "username": "luquinhasadm"
        },
        "conteudo": "Massa demais!",
        "createdAt": "2026-10-28T17:47:15.019781Z"
      }
    ],
    "caminhoImagem": null
  },
  {
    "id": "d7a844a5-d3db-4b14-afe0-b040b8f2d911",
    "descricao": "Entrem no grupo de quem monta em 20 segundos\nhttp://localhost:5173/conversa/convite/xg6KSeoMIl9EJQ-s5vTTRNVy5D7xYSOF94aadreRb9s",
    "scramble": null,
    "usuario": {
      "email": "lucasmilhao@gmail.com",
      "id": "1731b9a0-5e09-4357-a4e6-71207c148f93",
      "isGuest": false,
      "nome": "luquinhasadm",
      "picture": "https://res.cloudinary.com/t8awtqrh/image/upload/v1792962271/cubing2gether/hoavhwatapadzpdgfgup.jpg",
      "tipo": "ADMIN",
      "username": "luquinhasadm"
    },
    "createdAt": "2026-10-22T23:51:56.108933Z",
    "curtidas": 0,
    "comentarios": [],
    "caminhoImagem": null
  },
  {
    "id": "0db8d2a9-ed4e-4153-abad-369da9e287d2",
    "descricao": "Eu amo o @luquinhasadm ",
    "scramble": null,
    "usuario": {
      "email": "lucasmilhao26@gmail.com",
      "id": "26c7df60-6167-44d2-840d-aa32d8df6a3f",
      "isGuest": null,
      "nome": "Lucas Milhão",
      "picture": "https://lh3.googleusercontent.com/a/ACg8ocLAWgl-mHzz2Dj1wCZDfUYN9G5xAp5Qn8PDbfKjar8bvMsxlQ=s96-c",
      "tipo": "USUARIO",
      "username": "lucasmilhao21"
    },
    "createdAt": "2026-09-24T21:18:06.994157Z",
    "curtidas": 1,
    "comentarios": [],
    "caminhoImagem": null
  },
  {
    "id": "99da622e-1f04-4de5-93ad-cab69e938d96",
    "descricao": "EN:\nI am very happy to announce that i am the first creator of CUBING2GETHER!!! 😁\nPOL:\nZ wielką radością ogłaszam, że jestem pierwszym twórcą CUBING2GETHER!!! 😁",
    "scramble": null,
    "usuario": {
      "email": "tymon@gmail.com",
      "id": "c7f08fcf-9a66-479f-b81d-6851c0d7147d",
      "isGuest": false,
      "nome": "tymon",
      "picture": "https://res.cloudinary.com/t8awtqrh/image/upload/v1790267234/cubing2gether/lklxclrkab1x5keqlhiz.jpg",
      "tipo": "CRIADOR",
      "username": "tymon"
    },
    "createdAt": "2026-09-24T16:56:13.842596Z",
    "curtidas": 3,
    "comentarios": [
      {
        "id": "971f11b8-bef9-4946-9332-2a1213c09bf7",
        "usuario": {
          "email": "lucasmilhao@gmail.com",
          "id": "1731b9a0-5e09-4357-a4e6-71207c148f93",
          "isGuest": false,
          "nome": "luquinhasadm",
          "picture": "https://res.cloudinary.com/t8awtqrh/image/upload/v1792962271/cubing2gether/hoavhwatapadzpdgfgup.jpg",
          "tipo": "ADMIN",
          "username": "luquinhasadm"
        },
        "conteudo": "YOU DESERVE IT!",
        "createdAt": "2026-10-26T16:53:42.130103Z"
      },
      {
        "id": "b2045ba5-5bbe-4417-970e-3c74361b1461",
        "usuario": {
          "email": "lucasmilhao@gmail.com",
          "id": "1731b9a0-5e09-4357-a4e6-71207c148f93",
          "isGuest": false,
          "nome": "luquinhasadm",
          "picture": "https://res.cloudinary.com/t8awtqrh/image/upload/v1792962271/cubing2gether/hoavhwatapadzpdgfgup.jpg",
          "tipo": "ADMIN",
          "username": "luquinhasadm"
        },
        "conteudo": "Welcome!",
        "createdAt": "2026-09-24T17:14:34.410805Z"
      }
    ],
    "caminhoImagem": null
  },
  {
    "id": "adf65f8f-b390-4f8e-80af-26c2d12925d9",
    "descricao": "GENTE EU NAO ACREDITO O TYMON ESTÁ ME SEGUINDO!!!  I LOVE YOU @tymon ",
    "scramble": null,
    "usuario": {
      "email": "lucasmilhao@gmail.com",
      "id": "1731b9a0-5e09-4357-a4e6-71207c148f93",
      "isGuest": false,
      "nome": "luquinhasadm",
      "picture": "https://res.cloudinary.com/t8awtqrh/image/upload/v1792962271/cubing2gether/hoavhwatapadzpdgfgup.jpg",
      "tipo": "ADMIN",
      "username": "luquinhasadm"
    },
    "createdAt": "2026-09-24T16:32:34.615240Z",
    "curtidas": 2,
    "comentarios": [
      {
        "id": "06764e11-45bb-4d7c-b5a1-f0f524d6dfd0",
        "usuario": {
          "email": "tymon@gmail.com",
          "id": "c7f08fcf-9a66-479f-b81d-6851c0d7147d",
          "isGuest": false,
          "nome": "tymon",
          "picture": "https://res.cloudinary.com/t8awtqrh/image/upload/v1790267234/cubing2gether/lklxclrkab1x5keqlhiz.jpg",
          "tipo": "CRIADOR",
          "username": "tymon"
        },
        "conteudo": "beautiful platform! 🔥🔥🔥",
        "createdAt": "2026-09-24T16:33:52.863187Z"
      },
      {
        "id": "0e2c2820-24ef-4efd-8c26-5f5d31b942c4",
        "usuario": {
          "email": "arthurzinho@gmail.com",
          "id": "2ef71d84-c6da-467f-a2fb-be108f758ce4",
          "isGuest": false,
          "nome": "droguinhas",
          "picture": "https://res.cloudinary.com/t8awtqrh/image/upload/v1789515124/cubing2gether/a2lryysfrhrpwtzapnfz.webp",
          "tipo": "USUARIO",
          "username": "droguinhas"
        },
        "conteudo": "Eu te amo meu amor",
        "createdAt": "2026-09-24T21:48:02.778323Z"
      },
      {
        "id": "cc9c6c44-b823-4e87-be8f-0e3b5ccf12ac",
        "usuario": {
          "email": "tymon@gmail.com",
          "id": "c7f08fcf-9a66-479f-b81d-6851c0d7147d",
          "isGuest": false,
          "nome": "tymon",
          "picture": "https://res.cloudinary.com/t8awtqrh/image/upload/v1790267234/cubing2gether/lklxclrkab1x5keqlhiz.jpg",
          "tipo": "CRIADOR",
          "username": "tymon"
        },
        "conteudo": "lov u man",
        "createdAt": "2026-09-24T16:33:22.324774Z"
      },
      {
        "id": "e5b0514c-de52-42bb-8e5c-e8f1a11d3450",
        "usuario": {
          "email": "lucasmilhao683@gmail.com",
          "id": "debd1419-ebd2-40d0-a458-d7bba92de338",
          "isGuest": null,
          "nome": "shinyツ",
          "picture": "https://lh3.googleusercontent.com/a/ACg8ocKR5EECCVdIVfrNH3Rj9-lWb9ErPkJPlz6EAEmLvfoI-JRb4r5w=s96-c",
          "tipo": "USUARIO",
          "username": "shinyツ"
        },
        "conteudo": "Congratulations Tymon!!! ",
        "createdAt": "2026-10-22T22:19:49.083685Z"
      }
    ],
    "caminhoImagem": "https://res.cloudinary.com/t8awtqrh/image/upload/v1790267553/cubing2gether/tl7vuixkcgvp21jh9di3.webp"
  },
  {
    "id": "87bb3f0a-3b01-4866-a461-aee546527023",
    "descricao": "Ta tudo dominado",
    "scramble": {
      "id": "1998304f-c4c8-494d-964b-0892b582b288",
      "scramble": "R U R U ",
      "solution": "U' R' U' R'",
      "svg": "\u003Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 130 98\" width=\"130px\" version=\"1.1\" height=\"98px\"\u003E\n\t\u003Cg transform=\"matrix(1.0,0.0,0.0,1.0,0.5,0.5)\"\u003E\n\t\t\u003Crect x=\"2.0\" width=\"10.0\" y=\"34.0\" fill=\"#ff0000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"12.0\" width=\"10.0\" y=\"34.0\" fill=\"#ff0000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"22.0\" width=\"10.0\" y=\"34.0\" fill=\"#0000ff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"2.0\" width=\"10.0\" y=\"44.0\" fill=\"#ff8000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"12.0\" width=\"10.0\" y=\"44.0\" fill=\"#ff8000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"22.0\" width=\"10.0\" y=\"44.0\" fill=\"#ff8000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"2.0\" width=\"10.0\" y=\"54.0\" fill=\"#ff8000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"12.0\" width=\"10.0\" y=\"54.0\" fill=\"#ff8000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"22.0\" width=\"10.0\" y=\"54.0\" fill=\"#ff8000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"34.0\" width=\"10.0\" y=\"66.0\" fill=\"#ffff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"44.0\" width=\"10.0\" y=\"66.0\" fill=\"#ffff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"54.0\" width=\"10.0\" y=\"66.0\" fill=\"#ffffff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"34.0\" width=\"10.0\" y=\"76.0\" fill=\"#ffff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"44.0\" width=\"10.0\" y=\"76.0\" fill=\"#ffff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"54.0\" width=\"10.0\" y=\"76.0\" fill=\"#ffffff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"34.0\" width=\"10.0\" y=\"86.0\" fill=\"#ffff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"44.0\" width=\"10.0\" y=\"86.0\" fill=\"#ffff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"54.0\" width=\"10.0\" y=\"86.0\" fill=\"#ff8000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"98.0\" width=\"10.0\" y=\"34.0\" fill=\"#00ff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"108.0\" width=\"10.0\" y=\"34.0\" fill=\"#00ff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"118.0\" width=\"10.0\" y=\"34.0\" fill=\"#ffff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"98.0\" width=\"10.0\" y=\"44.0\" fill=\"#ffffff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"108.0\" width=\"10.0\" y=\"44.0\" fill=\"#0000ff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"118.0\" width=\"10.0\" y=\"44.0\" fill=\"#0000ff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"98.0\" width=\"10.0\" y=\"54.0\" fill=\"#ffffff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"108.0\" width=\"10.0\" y=\"54.0\" fill=\"#0000ff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"118.0\" width=\"10.0\" y=\"54.0\" fill=\"#0000ff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"66.0\" width=\"10.0\" y=\"34.0\" fill=\"#00ff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"76.0\" width=\"10.0\" y=\"34.0\" fill=\"#ff8000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"86.0\" width=\"10.0\" y=\"34.0\" fill=\"#ff8000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"66.0\" width=\"10.0\" y=\"44.0\" fill=\"#ff0000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"76.0\" width=\"10.0\" y=\"44.0\" fill=\"#ff0000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"86.0\" width=\"10.0\" y=\"44.0\" fill=\"#0000ff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"66.0\" width=\"10.0\" y=\"54.0\" fill=\"#ff0000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"76.0\" width=\"10.0\" y=\"54.0\" fill=\"#ff0000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"86.0\" width=\"10.0\" y=\"54.0\" fill=\"#0000ff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"34.0\" width=\"10.0\" y=\"2.0\" fill=\"#00ff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"44.0\" width=\"10.0\" y=\"2.0\" fill=\"#ffffff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"54.0\" width=\"10.0\" y=\"2.0\" fill=\"#ffffff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"34.0\" width=\"10.0\" y=\"12.0\" fill=\"#00ff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"44.0\" width=\"10.0\" y=\"12.0\" fill=\"#ffffff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"54.0\" width=\"10.0\" y=\"12.0\" fill=\"#ffffff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"34.0\" width=\"10.0\" y=\"22.0\" fill=\"#ffff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"44.0\" width=\"10.0\" y=\"22.0\" fill=\"#ffff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"54.0\" width=\"10.0\" y=\"22.0\" fill=\"#ff0000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"34.0\" width=\"10.0\" y=\"34.0\" fill=\"#ff0000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"44.0\" width=\"10.0\" y=\"34.0\" fill=\"#ff0000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"54.0\" width=\"10.0\" y=\"34.0\" fill=\"#ffffff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"34.0\" width=\"10.0\" y=\"44.0\" fill=\"#00ff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"44.0\" width=\"10.0\" y=\"44.0\" fill=\"#00ff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"54.0\" width=\"10.0\" y=\"44.0\" fill=\"#0000ff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"34.0\" width=\"10.0\" y=\"54.0\" fill=\"#00ff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"44.0\" width=\"10.0\" y=\"54.0\" fill=\"#00ff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"54.0\" width=\"10.0\" y=\"54.0\" fill=\"#0000ff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\u003C/g\u003E\n\u003C/svg\u003E"
    },
    "usuario": {
      "email": "lucasmilhao@gmail.com",
      "id": "1731b9a0-5e09-4357-a4e6-71207c148f93",
      "isGuest": false,
      "nome": "luquinhasadm",
      "picture": "https://res.cloudinary.com/t8awtqrh/image/upload/v1792962271/cubing2gether/hoavhwatapadzpdgfgup.jpg",
      "tipo": "ADMIN",
      "username": "luquinhasadm"
    },
    "createdAt": "2026-09-16T00:16:40.079933Z",
    "curtidas": 2,
    "comentarios": [],
    "caminhoImagem": null
  },
  {
    "id": "c41c4b72-7eb3-4845-ad5f-e0b72a3a711c",
    "descricao": "Eu gosto de pastel 👍",
    "scramble": null,
    "usuario": {
      "email": "lucasmilhao26@gmail.com",
      "id": "26c7df60-6167-44d2-840d-aa32d8df6a3f",
      "isGuest": null,
      "nome": "Lucas Milhão",
      "picture": "https://lh3.googleusercontent.com/a/ACg8ocLAWgl-mHzz2Dj1wCZDfUYN9G5xAp5Qn8PDbfKjar8bvMsxlQ=s96-c",
      "tipo": "USUARIO",
      "username": "lucasmilhao21"
    },
    "createdAt": "2026-09-15T23:20:25.742086Z",
    "curtidas": 0,
    "comentarios": [],
    "caminhoImagem": null
  },
  {
    "id": "d386c6ee-49b6-49cd-99d0-764fe3e17f94",
    "descricao": "Primeira postagem dessa brincadeira!",
    "scramble": null,
    "usuario": {
      "email": "lucasmilhao@gmail.com",
      "id": "1731b9a0-5e09-4357-a4e6-71207c148f93",
      "isGuest": false,
      "nome": "luquinhasadm",
      "picture": "https://res.cloudinary.com/t8awtqrh/image/upload/v1792962271/cubing2gether/hoavhwatapadzpdgfgup.jpg",
      "tipo": "ADMIN",
      "username": "luquinhasadm"
    },
    "createdAt": "2026-09-11T05:54:58.064566Z",
    "curtidas": 0,
    "comentarios": [],
    "caminhoImagem": null
  },
  {
    "id": "3103de7e-ba90-48af-9387-67d7e5083b5d",
    "descricao": "OLHA ESSA PORRA:\n",
    "scramble": {
      "id": "f3b8b6a4-64fa-4b24-b0e3-b31da78faa64",
      "scramble": "R U R' U'",
      "solution": "U R U' R'",
      "svg": "\u003Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 130 98\" width=\"130px\" version=\"1.1\" height=\"98px\"\u003E\n\t\u003Cg transform=\"matrix(1.0,0.0,0.0,1.0,0.5,0.5)\"\u003E\n\t\t\u003Crect x=\"2.0\" width=\"10.0\" y=\"34.0\" fill=\"#0000ff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"12.0\" width=\"10.0\" y=\"34.0\" fill=\"#ff8000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"22.0\" width=\"10.0\" y=\"34.0\" fill=\"#ff8000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"2.0\" width=\"10.0\" y=\"44.0\" fill=\"#ff8000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"12.0\" width=\"10.0\" y=\"44.0\" fill=\"#ff8000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"22.0\" width=\"10.0\" y=\"44.0\" fill=\"#ff8000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"2.0\" width=\"10.0\" y=\"54.0\" fill=\"#ff8000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"12.0\" width=\"10.0\" y=\"54.0\" fill=\"#ff8000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"22.0\" width=\"10.0\" y=\"54.0\" fill=\"#ff8000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"34.0\" width=\"10.0\" y=\"66.0\" fill=\"#ffff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"44.0\" width=\"10.0\" y=\"66.0\" fill=\"#ffff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"54.0\" width=\"10.0\" y=\"66.0\" fill=\"#ff0000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"34.0\" width=\"10.0\" y=\"76.0\" fill=\"#ffff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"44.0\" width=\"10.0\" y=\"76.0\" fill=\"#ffff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"54.0\" width=\"10.0\" y=\"76.0\" fill=\"#ffff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"34.0\" width=\"10.0\" y=\"86.0\" fill=\"#ffff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"44.0\" width=\"10.0\" y=\"86.0\" fill=\"#ffff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"54.0\" width=\"10.0\" y=\"86.0\" fill=\"#ffff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"98.0\" width=\"10.0\" y=\"34.0\" fill=\"#0000ff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"108.0\" width=\"10.0\" y=\"34.0\" fill=\"#ff0000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"118.0\" width=\"10.0\" y=\"34.0\" fill=\"#ff0000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"98.0\" width=\"10.0\" y=\"44.0\" fill=\"#0000ff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"108.0\" width=\"10.0\" y=\"44.0\" fill=\"#0000ff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"118.0\" width=\"10.0\" y=\"44.0\" fill=\"#0000ff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"98.0\" width=\"10.0\" y=\"54.0\" fill=\"#0000ff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"108.0\" width=\"10.0\" y=\"54.0\" fill=\"#0000ff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"118.0\" width=\"10.0\" y=\"54.0\" fill=\"#0000ff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"66.0\" width=\"10.0\" y=\"34.0\" fill=\"#ff0000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"76.0\" width=\"10.0\" y=\"34.0\" fill=\"#ff0000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"86.0\" width=\"10.0\" y=\"34.0\" fill=\"#ffffff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"66.0\" width=\"10.0\" y=\"44.0\" fill=\"#0000ff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"76.0\" width=\"10.0\" y=\"44.0\" fill=\"#ff0000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"86.0\" width=\"10.0\" y=\"44.0\" fill=\"#ff0000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"66.0\" width=\"10.0\" y=\"54.0\" fill=\"#ffffff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"76.0\" width=\"10.0\" y=\"54.0\" fill=\"#ff0000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"86.0\" width=\"10.0\" y=\"54.0\" fill=\"#ff0000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"34.0\" width=\"10.0\" y=\"2.0\" fill=\"#ffffff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"44.0\" width=\"10.0\" y=\"2.0\" fill=\"#ffffff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"54.0\" width=\"10.0\" y=\"2.0\" fill=\"#ff8000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"34.0\" width=\"10.0\" y=\"12.0\" fill=\"#ffffff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"44.0\" width=\"10.0\" y=\"12.0\" fill=\"#ffffff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"54.0\" width=\"10.0\" y=\"12.0\" fill=\"#00ff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"34.0\" width=\"10.0\" y=\"22.0\" fill=\"#ffffff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"44.0\" width=\"10.0\" y=\"22.0\" fill=\"#ffffff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"54.0\" width=\"10.0\" y=\"22.0\" fill=\"#00ff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"34.0\" width=\"10.0\" y=\"34.0\" fill=\"#00ff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"44.0\" width=\"10.0\" y=\"34.0\" fill=\"#00ff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"54.0\" width=\"10.0\" y=\"34.0\" fill=\"#ffff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"34.0\" width=\"10.0\" y=\"44.0\" fill=\"#00ff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"44.0\" width=\"10.0\" y=\"44.0\" fill=\"#00ff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"54.0\" width=\"10.0\" y=\"44.0\" fill=\"#ffffff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"34.0\" width=\"10.0\" y=\"54.0\" fill=\"#00ff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"44.0\" width=\"10.0\" y=\"54.0\" fill=\"#00ff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"54.0\" width=\"10.0\" y=\"54.0\" fill=\"#00ff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\u003C/g\u003E\n\u003C/svg\u003E"
    },
    "usuario": {
      "email": "lucasmilhao683@gmail.com",
      "id": "debd1419-ebd2-40d0-a458-d7bba92de338",
      "isGuest": null,
      "nome": "shinyツ",
      "picture": "https://lh3.googleusercontent.com/a/ACg8ocKR5EECCVdIVfrNH3Rj9-lWb9ErPkJPlz6EAEmLvfoI-JRb4r5w=s96-c",
      "tipo": "USUARIO",
      "username": "shinyツ"
    },
    "createdAt": "2026-09-11T05:26:36.309599Z",
    "curtidas": 1,
    "comentarios": [
      {
        "id": "778f094e-ae31-4fe3-8e65-fb70d2a0d683",
        "usuario": {
          "email": "lucasmilhao@gmail.com",
          "id": "1731b9a0-5e09-4357-a4e6-71207c148f93",
          "isGuest": false,
          "nome": "luquinhasadm",
          "picture": "https://res.cloudinary.com/t8awtqrh/image/upload/v1792962271/cubing2gether/hoavhwatapadzpdgfgup.jpg",
          "tipo": "ADMIN",
          "username": "luquinhasadm"
        },
        "conteudo": "Amei cara parabgéns",
        "createdAt": "2026-09-14T17:07:38.698142Z"
      }
    ],
    "caminhoImagem": null
  },
  {
    "id": "362e3bfb-7d2f-4b32-8d99-47bc746ac066",
    "descricao": "To de volta povo",
    "scramble": null,
    "usuario": {
      "email": "lucasmilhao683@gmail.com",
      "id": "debd1419-ebd2-40d0-a458-d7bba92de338",
      "isGuest": null,
      "nome": "shinyツ",
      "picture": "https://lh3.googleusercontent.com/a/ACg8ocKR5EECCVdIVfrNH3Rj9-lWb9ErPkJPlz6EAEmLvfoI-JRb4r5w=s96-c",
      "tipo": "USUARIO",
      "username": "shinyツ"
    },
    "createdAt": "2026-09-11T05:25:27.285862Z",
    "curtidas": 1,
    "comentarios": [],
    "caminhoImagem": null
  }
];

  return (
    <View style={styles.container}>
      <FlatList
        data={postagens ?? []}
        keyExtractor={(postagem) => String(postagem.id)}
        renderItem={({ item }) => (
          <PostCard
            postagem={item}
            onPressUsuario={(usuario) => {
              console.log('Usuário pressionado:', usuario);
            }}
          />
        )}
        ListEmptyComponent={
          <Text>Nenhuma postagem encontrada.</Text>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070303',
  },
  listContent: {
    flexGrow: 1,
    padding: 16,
  },
});