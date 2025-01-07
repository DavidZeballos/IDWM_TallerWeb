import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/users/user.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  users: any[] = [];

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers({}).subscribe({
      next: (data) => (this.users = data),
      error: (err) =>
        this.toastr.error('Error al cargar usuarios: ' + err.message),
    });
  }

  editUser(userId: string): void {
    this.router.navigate([`/admin/users/edit/${userId}`]);
  }

  toggleStatus(userId: string): void {
    const user = this.users.find((u) => u.id === userId);
    if (!user) return;

    this.userService.changeUserStatus(userId, !user.status).subscribe({
      next: () => {
        user.status = !user.status;
        this.toastr.success('Estado actualizado correctamente.');
      },
      error: (err) =>
        this.toastr.error('Error al cambiar el estado: ' + err.message),
    });
  }

  navigateToCreateUser(): void {
    this.router.navigate(['/admin/users/create']);
  }
}
