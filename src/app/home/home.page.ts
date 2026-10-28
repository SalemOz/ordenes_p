import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonGrid, IonRow, IonCol,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonSearchbar, IonItem, IonInput, IonText, IonButton, IonButtons,
  IonList, IonAvatar, IonLabel, IonBadge, IonModal,
  ToastController,
} from '@ionic/angular';
import { Orden } from '../models/orden';
import { OrdenService } from '../services/orden.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonGrid, IonRow, IonCol,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonSearchbar, IonItem, IonInput, IonText, IonButton, IonButtons,
    IonList, IonAvatar, IonLabel, IonBadge, IonModal,
  ],
})
export class HomePage implements OnInit {

  //datos
  ordenes: Orden[] = []; //copia original
  ordenesFiltradas: Orden[] = [];

//filtros
busqueda = '';
montoMin: number | null=null;
montoMax: number | null= null;
error = '';

//modal
modalAbierto = false;
seleccionada: Orden | null = null;

//getter service + toast
  constructor(
    private ordenService: OrdenService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.ordenService.getOrdenes().subscribe(data => {
      this.ordenes = data;     // guardamos la copia original
      this.aplicarFiltros();   // mostramos la lista
    });
  }

    aplicarFiltros (){
    this.error = '';

    if (this.montoMin !== null && this.montoMax !== null && this.montoMin > this.montoMax) {
      this.error = 'El monto mínimo no puede ser mayor que el máximo';
      this.ordenesFiltradas = [];
      return;
      }
      const min = this.montoMin ?? 0;
      const max = this.montoMax ?? Infinity;
      this.ordenesFiltradas = this.ordenes.filter(o => o.monto >= min && o.monto <= max);
    }

    limpiarFiltros() {
      this.montoMin = null;
      this.montoMax = null;
      this.aplicarFiltros();
    }

    get totalVentas (): number {
      return this.ordenesFiltradas.reduce((suma, o) => suma + o.monto, 0);
    }

    abrirModal (orden: Orden) {
      this.seleccionada = orden;
      this.modalAbierto = true;
    }

    cerrarModal() {
      this.modalAbierto = false;
    }

    get iva () : number {
      return ( this.seleccionada?.monto ?? 0) * 0.19;
    }

    get total() : number {
      return ( this.seleccionada?.monto ?? 0) + this.iva;
    }

    async facturar() {
      const id = this.seleccionada?.id;
      this.cerrarModal();
      const toast = await this.toastCtrl.create({
        message: `Orden #${id} facturada correctamente`,
        duration: 2500,
        color: 'succes'
      });
      await toast.present();
    }
  }
