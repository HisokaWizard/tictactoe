import { Observable, fromEvent } from 'rxjs';

export function clickListener(element) {
    return fromEvent(element, 'click');
}