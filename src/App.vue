<template>
    <div class="background">
        <div style="display: flex; align-items: center;">
            <h1 class="title">
                RDF Retrieval System
            </h1>
        </div>

        <div class="display">
            <el-card class="input" :style="size(0.9, 0.4, 0)">
                <div class="operation" style="display: flex;">
                    <el-row v-if="!disable">
                        <el-button type="success" @mousedown="e => e.preventDefault()" :style="size(0.05, 0.05, 0.01)"
                            @click="execute_sparql" plain>Ececute</el-button>
                        <el-button type="info" @mousedown="e => e.preventDefault()" @click="close_db"
                            :style="size(0.05, 0.06, 0.01)" plain>Close DB</el-button>
                        <el-button type="info" @mousedown="e => e.preventDefault()" @click="create_open"
                            :style="size(0.05, 0.06, 0.01)" plain>Create DB</el-button>
                        <el-button type="info" @mousedown="e => e.preventDefault()" @click="delete_db"
                            :style="size(0.05, 0.06, 0.01)" plain>Delete DB</el-button>
                    </el-row>
                    <el-row v-else>
                        <el-button type="success" :style="size(0.05, 0.05, 0.01)" plain disabled>Ececute</el-button>
                        <el-button type="info" :style="size(0.05, 0.06, 0.01)" plain disabled>Close
                            DB</el-button>
                        <el-button type="info" :style="size(0.05, 0.06, 0.01)" plain disabled>Create
                            DB</el-button>
                        <el-button type="info" :style="size(0.05, 0.06, 0.01)" plain disabled>Delete DB</el-button>
                    </el-row>
                </div>

                <el-select v-model="db_name" :disabled="disable" placeholder="Select DB" :style="size(0.05, 0.254, 0.01)"
                    style="margin-top: 2%;">
                    <el-option v-for="db in db_list" :key="db" :label="db" :value="db" />
                </el-select>
                <textarea class="textarea" placeholder="pleast input sparql" wrap="off"
                    style="width: 100%;resize: none;overflow:scroll;margin-top: 2%;" v-model="sparql"
                    :style="{ height: this.screen_height * 0.7 + 'px' }">
                </textarea>

                <!-- <el-input v-model="sparql" :rows="this.screen_width * 0.0125" type="textarea" :resize="'none'"
                    placeholder="input sparql" style="font-size: 17.8px;top: 20px;" /> -->
            </el-card>

            <el-card class="input" style="margin-left: 1%;" :style="size(0.9, 0.5, 0)">
                <div style="display: flex;">
                    <div :style="size(0.095, 0.3, 0.01)"
                        style="border: 1px solid var(--el-border-color);border-radius: 10px;box-shadow: 2px 2px 2px rgba(0,0,0,0.15);margin-right: 3%;">
                        <el-row style="margin-top: 10px;">
                            <el-col :span="10" style="text-align: center;">
                                <div :style="{ 'font-size': this.screen_width * 0.008 + 'px' }">
                                    Triplets
                                </div>
                                <el-statistic :value="triplet_cnt"
                                    :value-style="{ 'font-size': this.screen_width * 0.013 + 'px' }">
                                </el-statistic>
                            </el-col>
                            <el-col :span="6" style="text-align: center;">
                                <div :style="{ 'font-size': this.screen_width * 0.008 + 'px' }">
                                    Predicates
                                </div>
                                <el-statistic :value="predicate_cnt"
                                    :value-style="{ 'font-size': this.screen_width * 0.013 + 'px' }">
                                </el-statistic>
                            </el-col>
                            <el-col :span="8" style="text-align: center;">
                                <div :style="{ 'font-size': this.screen_width * 0.008 + 'px' }">
                                    Entities
                                </div>
                                <el-statistic :value="entity_cnt" :style="{ 'font-size': this.screen_width * 0.01 + 'px' }"
                                    :value-style="{ 'font-size': this.screen_width * 0.013 + 'px' }">
                                </el-statistic>
                            </el-col>
                        </el-row>
                    </div>
                    <div :style="size(0.095, 0.15, 0.01)"
                        style="border: 1px solid var(--el-border-color);border-radius: 10px;box-shadow: 2px 2px 2px rgba(0,0,0,0.15);margin-bottom: 20px;">
                        <el-row style="margin-top: 10px;">
                            <el-col :span="12" style="text-align: center;">
                                <div :style="{ 'font-size': this.screen_width * 0.008 + 'px' }">
                                    Results count
                                </div>
                                <el-statistic :value="query_result[1]"
                                    :value-style="{ 'font-size': this.screen_width * 0.013 + 'px' }">
                                </el-statistic>
                            </el-col>

                            <el-col :span="10" style="text-align: center;">
                                <div :style="{ 'font-size': this.screen_width * 0.008 + 'px' }">
                                    query time
                                </div>
                                <el-statistic :value="query_result[2] + ' ms'"
                                    :value-style="{ 'font-size': this.screen_width * 0.013 + 'px' }">
                                </el-statistic>
                            </el-col>
                        </el-row>
                    </div>
                </div>

                <textarea class="textarea" placeholder="" wrap="off" style="width: 100%;resize: none;overflow:scroll;"
                    readonly v-model="query_result[0]" :style="{ height: this.screen_height * 0.7 + 'px' }">
                </textarea>
            </el-card>
        </div>
    </div>

    <el-dialog v-model="create" title="Create DB" width="30%" :before-close="create_close" :show-close="!disable"
        :close-on-click-modal="false" :close-on-press-escape="false">

        <div style="margin-bottom: 30px;font-size: 20px;">
            db name:
            <el-input v-model="upload_db_name" placeholder="input db name"
                style="width: 200px;height: 30px;font-size: 17px;" />
        </div>

        <el-upload ref="upload" class="el-icon--upload" action :http-request="upload_file"
            :headers="{ 'Content-Type': 'multipart/form-data' }" :limit="1" drag multiple>
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
                Drop file here or <em>click to upload</em>
            </div>
        </el-upload>

        <template #footer>
            <span class="dialog-footer">
                <el-button v-if="disable == false" type="primary" @click="create_db">Create</el-button>
                <el-button v-if="disable == true" type="primary" disabled>Create</el-button>
            </span>
        </template>
    </el-dialog>
</template>
  
<script>
import { ElMessage } from 'element-plus'

const change_db_success = () => {
    ElMessage({
        message: 'Open database success.',
        type: 'success',
    })
}

const upload_success = () => {
    ElMessage({
        message: 'Upload file success.',
        type: 'success',
    })
}

const create_db_success = () => {
    ElMessage.success('Create database success.')
}

const create_db_error = () => {
    ElMessage.error('Create database error.')
}

const close_db_success = () => {
    ElMessage.success('Close database success.')
}

const delete_db_success = () => {
    ElMessage.success('Delete database success.')
}

export default {

    data() {
        return {
            screen_height: 800,
            screen_width: 1830,
            ip: "10.60.83.91",
            db_name: "",
            upload_db_name: "",
            upload_file_name: "",
            triplet_cnt: 0,
            predicate_cnt: 0,
            entity_cnt: 0,
            sparql: "",
            query_result: ["", 0, 0],
            create: false,
            disable: false,
            db_list: []
        };
    },
    methods: {
        size(h, w, f) {
            if (f != 0) {
                return {
                    height: `${this.screen_height * h}px`,
                    width: `${this.screen_width * w}px`,
                    fontSize: `${this.screen_width * f}px`
                };
            } else {
                return {
                    height: `${this.screen_height * h}px`,
                    width: `${this.screen_width * w}px`
                };
            }
        },
        image_url() {
            return new URL(`./assets/icon.png`, import.meta.url).href
        },
        create_open() {
            this.create = true;
        },
        create_close() {
            this.create = false;
        },
        list_db() {
            this.$axios.get("http://" + this.ip + ":8080/peirs/list", {}).then((result) => {
                this.db_list = result.data.data
            })
        },
        upload_file(item) {
            console.log("uploading")
            let FormDatas = new FormData()
            FormDatas.append('rdf_file', item.file);
            this.$axios({
                method: 'post',
                url: 'http://' + this.ip + ':8080/peirs/upload',
                headers: { "Content-Type": "multipart/form-data" },
                timeout: 30000,
                data: FormDatas
            }).then(res => {
                if (res.data.id != '' || res.data.id != null) {
                    upload_success()
                    this.upload_file_name = item.file.name
                }
            })
        },
        create_db() {
            this.disable = true
            this.$axios.post('http://' + this.ip + ':8080/peirs/create',
                { 'db_name': this.upload_db_name, 'file_name': this.upload_file_name }
            ).then((result) => {
                if (result.data.code == 1) {
                    create_db_success()
                    this.list_db()
                } else
                    create_db_error()
                this.disable = false
            })
        },
        close_db() {
            this.disable = true
            this.$axios.get("http://" + this.ip + ":8080/peirs/close", {}).then((result) => {
                if (result.data.code == 1) {
                    this.db_name = ""
                    close_db_success()
                    this.entity_cnt = 0
                    this.triplet_cnt = 0
                    this.predicate_cnt = 0
                }
                this.disable = false
            })
        },
        delete_db() {
            this.$axios.post('http://' + this.ip + ':8080/peirs/delete',
                { 'db_name': this.db_name }
            ).then((result) => {
                if (result.data.code == 1) {
                    delete_db_success()
                    this.list_db()
                    this.db_name = ""
                    this.entity_cnt = 0
                    this.triplet_cnt = 0
                    this.predicate_cnt = 0
                }
            })
        },
        execute_sparql() {
            this.disable = true
            this.$axios.post('http://' + this.ip + ':8080/peirs/query',
                { 'sparql': this.sparql.replace(/\n/g, ' ') }
            ).then((result) => {
                console.log(result.data);
                this.query_result = [result.data.results, result.data.cnt, result.data.time]
                this.disable = false
            })
        }
    },

    created() {
        this.list_db()
    },

    watch: {
        db_name() {
            if (this.disable == false) {
                this.disable = true
                this.$axios.post('http://' + this.ip + ':8080/peirs/load_db', { 'db_name': this.db_name }).then((result) => {
                    console.log(result)
                    this.$axios.get("http://" + this.ip + ":8080/peirs/info", {}).then((result) => {
                        console.log(result.data.data)
                        this.entity_cnt = result.data.data.entities
                        this.triplet_cnt = result.data.data.triplets
                        this.predicate_cnt = result.data.data.predicates
                        change_db_success()
                        this.disable = false
                    })
                })
            }
            // this.disable = false
        }
    },

    beforeCreate() {
        this.$nextTick(() => {
            // 减去导航的高度(110)
            this.screen_height = window.innerHeight - 110
            // if (this.screen_height < 800)
            //     this.screen_height = 800
            this.screen_width = window.innerWidth
            // if (this.screen_width < 830)
            //   this.screen_width = 800
            // console.log(this.screen_height, this.screen_width)
        })
    }
};
</script>
  
<style scoped>
.textarea {
    border: none;
    outline: none;
    padding: 0;
    margin: 0;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: none;
    background-color: transparent;
    font-size: inherit;
    width: 100%;

    display: inline-block;
    resize: vertical;
    padding: 5px 15px;
    line-height: 1.5;
    box-sizing: border-box;
    color: #606266;
    background-color: #fff;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

}

/* 鼠标hover */
.textarea:hover {
    border-color: #c0c4cc;
}

/* 获得焦点 */
.textarea:focus {
    border-color: #8fb2f8;
}

.background {
    background: #ececec;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
}

.title {
    font-weight: bold;
    font-size: 50px;
    text-align: center;
    margin-top: 20px;
}

.display {
    display: flex;
    justify-content: space-between;
}

.statistic-title {
    margin-left: 0px;
    margin-top: -12px;
    margin-bottom: -20px;
    font-weight: bold;
    font-size: 20px;
    text-align: center;
}

.statistic-num {
    margin-left: -3px;
    margin-top: -12px;
    margin-bottom: -20px;
    font-weight: bold;
    font-size: 19px;
    text-align: center;
}
</style>