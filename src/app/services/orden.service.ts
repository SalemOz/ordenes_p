import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Orden } from '../models/orden';

@Injectable({ providedIn: 'root' })
export class OrdenService {

  // Dirección de donde vienen los datos
  private url = 'https://jsonplaceholder.typicode.com/posts';

  // HttpClient es la herramienta para hacer peticiones a internet
  constructor(private http: HttpClient) {}

  getOrdenes(): Observable<Orden[]> {
    return this.http.get<any[]>(this.url).pipe(   // 1) Pide los datos (GET)
      map(posts =>                                // 2) Cuando lleguen, los transforma
        posts.slice(0, 20).map(p => ({            //    Toma solo los primeros 20
          id: p.id,
          cliente: 'Cliente ' + p.userId,
          producto: p.title.split(' ').slice(0, 3).join(' '), // primeras 3 palabras del título
          monto: ((p.id * 37) % 90 + 10) * 1000,  // precio inventado entre 10.000 y 99.000
          stock: (p.id * 7) % 12,                 // stock inventado entre 0 y 11
        }))
      )
    );
  }
}
