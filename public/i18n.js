// US-022 / US-024: diccionario es/ja/zh y aplicación de etiquetas en la UI.
const TRADUCCIONES = {
  es: {
    titulo: 'ABM de Clientes',
    subtitulo: 'Proyecto base SDLC — las funcionalidades se habilitan al implementar cada User Story',
    nuevoCliente: 'Nuevo cliente',
    editarCliente: 'Editar cliente',
    nombre: 'Nombre',
    apellido: 'Apellido',
    documento: 'Documento',
    email: 'Email',
    guardar: 'Guardar',
    cancelar: 'Cancelar',
    buscar: 'Buscar por nombre, apellido o documento... (US-005)',
    clientes: 'Clientes',
    colId: 'ID',
    colAcciones: 'Acciones',
    sinClientes: 'No hay clientes cargados.',
    editar: 'Editar',
    eliminar: 'Eliminar',
    confirmarEliminar: '¿Eliminar al cliente {nombre}?',
    errorEliminar: 'No se pudo eliminar el cliente',
    errorGuardar: 'Error al guardar el cliente',
    errorConexion: 'Error de conexión',
    cambiarIdioma: 'Cambiar idioma',
    placeholderNombre: 'Juan',
    placeholderApellido: 'Pérez',
    placeholderDocumento: '30123456',
    placeholderEmail: 'juan@mail.com',
  },
  ja: {
    titulo: '顧客管理',
    subtitulo: 'SDLCベースプロジェクト — 各ユーザーストーリーの実装で機能が有効になります',
    nuevoCliente: '新規顧客',
    editarCliente: '顧客の編集',
    nombre: '名',
    apellido: '姓',
    documento: '書類番号',
    email: 'メール',
    guardar: '保存',
    cancelar: 'キャンセル',
    buscar: '氏名または書類番号で検索...',
    clientes: '顧客一覧',
    colId: 'ID',
    colAcciones: '操作',
    sinClientes: '顧客が登録されていません。',
    editar: '編集',
    eliminar: '削除',
    confirmarEliminar: '顧客「{nombre}」を削除しますか？',
    errorEliminar: '顧客を削除できませんでした',
    errorGuardar: '顧客の保存中にエラーが発生しました',
    errorConexion: '接続エラー',
    cambiarIdioma: '言語を変更',
    placeholderNombre: '太郎',
    placeholderApellido: '山田',
    placeholderDocumento: '30123456',
    placeholderEmail: 'taro@mail.com',
  },
  zh: {
    titulo: '客户管理',
    subtitulo: 'SDLC基础项目 — 每实现一个用户故事即启用对应功能',
    nuevoCliente: '新建客户',
    editarCliente: '编辑客户',
    nombre: '名',
    apellido: '姓',
    documento: '证件号码',
    email: '邮箱',
    guardar: '保存',
    cancelar: '取消',
    buscar: '按姓名或证件号码搜索...',
    clientes: '客户列表',
    colId: 'ID',
    colAcciones: '操作',
    sinClientes: '暂无客户。',
    editar: '编辑',
    eliminar: '删除',
    confirmarEliminar: '确定删除客户「{nombre}」吗？',
    errorEliminar: '无法删除客户',
    errorGuardar: '保存客户时出错',
    errorConexion: '连接错误',
    cambiarIdioma: '更改语言',
    placeholderNombre: '伟',
    placeholderApellido: '王',
    placeholderDocumento: '30123456',
    placeholderEmail: 'wei@mail.com',
  },
};

function t(lang, key, vars) {
  const dict = TRADUCCIONES[lang] || TRADUCCIONES.es;
  let text = dict[key] ?? TRADUCCIONES.es[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replaceAll(`{${k}}`, v);
    }
  }
  return text;
}

function aplicarIdioma(lang) {
  const locale = TRADUCCIONES[lang] ? lang : 'es';
  if (typeof document === 'undefined') return locale;

  document.documentElement.lang = locale;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(locale, el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.setAttribute('placeholder', t(locale, el.dataset.i18nPlaceholder));
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    el.setAttribute('aria-label', t(locale, el.dataset.i18nAria));
  });

  return locale;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TRADUCCIONES, t, aplicarIdioma };
}
