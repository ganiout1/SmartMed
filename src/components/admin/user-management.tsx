"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createUser, deleteUser, updateUserProfile } from "@/app/dashboard/admin/users/actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type UserData = {
  id: string;
  full_name: string;
  email: string;
  course_count: number;
};

interface UserManagementProps {
  title: string;
  role: "lecturer" | "student";
  users: UserData[];
}

export function UserManagement({ title, role, users }: UserManagementProps) {
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredUsers = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("role", role);

    const result = await createUser(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`${title} berhasil ditambahkan`);
      setIsAddOpen(false);
    }
    setLoading(false);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser) return;
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const result = await updateUserProfile(selectedUser.id, role, formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Data ${title.toLowerCase()} berhasil diubah`);
      setIsEditOpen(false);
    }
    setLoading(false);
  };

  const handleDeleteSubmit = async () => {
    if (!selectedUser) return;
    setLoading(true);

    const result = await deleteUser(selectedUser.id, role);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`${title} berhasil dihapus`);
      setIsDeleteOpen(false);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4 bg-background p-6 rounded-lg border">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau email..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah {title}
        </Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Nama Lengkap</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-center">
                {role === "lecturer" ? "Jumlah Kursus (Diampu)" : "Jumlah Kursus (Diikuti)"}
              </TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Tidak ada data.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="text-center">{user.course_count}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsEditOpen(true);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsDeleteOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ADD DIALOG */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah {title} Baru</DialogTitle>
            <DialogDescription>
              Masukkan detail {title.toLowerCase()} baru. Password akan digunakan untuk login.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input id="fullName" name="fullName" required placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required placeholder="Minimal 6 karakter" minLength={6} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} disabled={loading}>
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {title}</DialogTitle>
            <DialogDescription>
              Ubah data {title.toLowerCase()} ini. Email tidak dapat diubah di sini.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-fullName">Nama Lengkap</Label>
              <Input
                id="edit-fullName"
                name="fullName"
                required
                defaultValue={selectedUser?.full_name}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={selectedUser?.email} disabled className="bg-muted" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} disabled={loading}>
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus {title}</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus <b>{selectedUser?.full_name}</b>?
              Tindakan ini tidak dapat dibatalkan dan akan menghapus seluruh data terkait.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={loading}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDeleteSubmit} disabled={loading}>
              {loading ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
