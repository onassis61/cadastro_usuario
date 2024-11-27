const form = document.getElementById('userForm');
const userList = document.getElementById('userList');
const submitButton = document.getElementById('submitButton');

// Carregar usuários ao abrir a página
document.addEventListener('DOMContentLoaded', loadUsers);

// Enviar formulário
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = document.getElementById('userId').value;
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;

    if (id) {
        await updateUser(id, nome, email);
    } else {
        await addUser(nome, email);
    }

    form.reset();
    loadUsers();
});

// Carregar lista de usuários
async function loadUsers() {
    const response = await fetch('http://localhost:3000/usuarios');
    const users = await response.json();

    userList.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.nome}</td>
            <td>${user.email}</td>
            <td>
                <button class="edit" onclick="editUser(${user.id}, '${user.nome}', '${user.email}')">Editar</button>
                <button class="delete" onclick="deleteUser(${user.id})">Excluir</button>
            </td>
        </tr>
    `).join('');
}

// Adicionar usuário
async function addUser(nome, email) {
    await fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email }),
    });
}

// Editar usuário
function editUser(id, nome, email) {
    document.getElementById('userId').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('email').value = email;
    submitButton.textContent = 'Atualizar';
}

// Atualizar usuário
async function updateUser(id, nome, email) {
    await fetch(`http://localhost:3000/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email }),
    });
    submitButton.textContent = 'Cadastrar';
}

// Excluir usuário
async function deleteUser(id) {
    if (confirm('Deseja realmente excluir este usuário?')) {
        await fetch(`http://localhost:3000/usuarios/${id}`, { method: 'DELETE' });
        loadUsers();
    }
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
    
        const id = document.getElementById('userId').value;
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
    
        // Validação no frontend
        if (nome.length < 15) {
            alert('O campo Nome deve ter no mínimo 15 caracteres.');
            return;
        }
    
        if (!email.includes('@')) {
            alert('Por favor, insira um email válido.');
            return;
        }
    
        // Envia para o backend
        if (id) {
            await updateUser(id, nome, email);
        } else {
            await addUser(nome, email);
        }
    
        form.reset();
        loadUsers();
    });
}