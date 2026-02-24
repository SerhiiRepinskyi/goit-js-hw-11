import Notiflix from 'notiflix';

export function notifySuccess(message) {
  Notiflix.Notify.success(message);
}

export function notifyError(message) {
  Notiflix.Notify.failure(message);
}

export function notifyInfo(message) {
  Notiflix.Notify.info(message);
}

export function notifyWarning(message) {
  Notiflix.Notify.warning(message);
}
