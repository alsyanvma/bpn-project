<template>
    <div class="container">
        <div class="header">
            <h1 class="title">Daftar Surat</h1>
            <button @click="toggleForm" class="btn add-button">Tambah Surat</button>
        </div>

        <!-- Form for adding a letter, positioned over the table -->
        <div v-if="isFormVisible" class="form-container">
            <h2>Tambah Surat</h2>
            <form @submit.prevent="submitForm">
                <label for="first">First Name:</label>
                <input type="text" v-model="newLetter.first" id="first" required />

                <label for="last">Last Name:</label>
                <input type="text" v-model="newLetter.last" id="last" required />

                <label for="handle">Handle:</label>
                <input type="text" v-model="newLetter.handle" id="handle" required />

                <div class="form-actions">
                    <button type="submit" class="btn submit">Simpan Surat</button>
                    <button type="button" @click="toggleForm" class="btn cancel">Batal</button>
                </div>
            </form>
        </div>

        <!-- Display the letter list -->
        <div class="table-container" :style="{ opacity: isFormVisible ? 0.3 : 1 }">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Handle</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(letter, index) in letters" :key="letter.id" class="table-row">
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ letter.first }}</td>
                        <td>{{ letter.last }}</td>
                        <td>{{ letter.handle }}</td>
                        <td>
                            <button @click="viewLetter(letter)" class="btn">View</button>
                            <button @click="deleteLetter(letter.id)" class="btn delete">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SuratPage',
    data() {
        return {
            letters: [
                { id: 1, first: 'Mark', last: 'Otto', handle: '@mdo' },
                { id: 2, first: 'Jacob', last: 'Thornton', handle: '@fat' },
                { id: 3, first: 'Larry', last: 'the Bird', handle: '@twitter' },
            ],
            isFormVisible: false,
            newLetter: {
                first: '',
                last: '',
                handle: ''
            }
        };
    },
    methods: {
        toggleForm() {
            this.isFormVisible = !this.isFormVisible;
        },
        viewLetter(letter) {
            alert(`Viewing letter from: ${letter.first} ${letter.last}`);
        },
        deleteLetter(id) {
            alert(`Deleted letter with ID: ${id}`);
        },
        submitForm() {
            const newId = this.letters.length + 1;
            this.letters.push({
                id: newId,
                ...this.newLetter
            });
            this.newLetter.first = '';
            this.newLetter.last = '';
            this.newLetter.handle = '';
            this.toggleForm();
        }
    }
};
</script>

<style scoped>
.container {
    max-width: 900px;
    margin: 0 auto;
    padding: 40px;
    font-family: 'Helvetica Neue', Arial, sans-serif;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.title {
    font-size: 2.4rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0;
}

.add-button {
    padding: 12px 20px;
    background-color: #007BFF;
    color: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: bold;
}

.add-button:hover {
    background-color: #0056b3;
    transform: scale(1.1);
}

.form-container {
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    padding: 30px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    z-index: 10;
    width: 80%;
    max-width: 600px;
    transition: opacity 0.3s ease;
}

.form-container h2 {
    margin-bottom: 20px;
    font-size: 1.8rem;
    color: #333;
}

form label {
    display: block;
    margin-top: 20px;
    font-size: 1.1rem;
    color: #555;
}

form input {
    width: 100%;
    padding: 14px;
    margin-top: 8px;
    margin-bottom: 18px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1.1rem;
    box-sizing: border-box;
    transition: border-color 0.3s ease;
}

form input:focus {
    border-color: #007BFF;
}

form button {
    padding: 12px 25px;
    margin-top: 10px;
    border: none;
    cursor: pointer;
    font-weight: bold;
    border-radius: 8px;
    transition: background-color 0.3s ease, transform 0.3s ease;
}

.submit {
    background-color: #28a745;
    color: white;
}

.submit:hover {
    background-color: #218838;
    transform: scale(1.05);
}

.cancel {
    background-color: #dc3545;
    color: white;
    margin-left: 12px;
}

.cancel:hover {
    background-color: #c82333;
    transform: scale(1.05);
}

.table-container {
    position: relative;
    transition: opacity 0.3s ease;
}

.table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
    border-radius: 8px;
}

.table th,
.table td {
    padding: 15px;
    text-align: left;
    font-size: 1.1rem;
    color: #333;
}

.table th {
    background-color: #f4f4f4;
    font-weight: 600;
}

.table-row {
    transition: all 0.3s ease;
}

.table-row:hover {
    background-color: #f1f1f1;
    transform: scale(1.02);
}

.table-row:nth-child(even) {
    background-color: #f9f9f9;
}

.btn {
    padding: 10px 18px;
    margin: 5px;
    border: none;
    cursor: pointer;
    background-color: #007BFF;
    color: white;
    border-radius: 8px;
    transition: background-color 0.3s ease, transform 0.3s ease;
}

.btn:hover {
    background-color: #0056b3;
    transform: scale(1.05);
}

.delete {
    background-color: #dc3545;
}

.delete:hover {
    background-color: #c82333;
    transform: scale(1.05);
}
</style>
